import React, { useState, useRef, useCallback } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	Dimensions,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { addressStyles as styles } from "@/styles/Address/AddressStyle";

// Salvador, BA como região padrão
const DEFAULT_REGION = {
	latitude: -12.9714,
	longitude: -38.5014,
	latitudeDelta: 0.05,
	longitudeDelta: 0.05,
};

interface NominatimResult {
	place_id: number;
	display_name: string;
	lat: string;
	lon: string;
	address: {
		road?: string;
		suburb?: string; // bairro
		city?: string;
		town?: string;
		state?: string;
		postcode?: string;
	};
}

interface SelectedAddress {
	formatted: string;
	street: string;
	number: string;
	complement: string;
	neighborhood: string;
	city: string;
	state: string;
	cep: string;
	latitude: number;
	longitude: number;
}

interface AddressPickerScreenProps {
	isLoggedIn?: boolean;
	onAddressConfirmed: (address: SelectedAddress) => void;
	onSaveAddress?: (address: SelectedAddress) => void;
}

// Busca coordenadas pelo endereço via Nominatim (OpenStreetMap)
const geocodeAddress = async (
	address: string,
): Promise<{ lat: number; lng: number } | null> => {
	try {
		const params = new URLSearchParams({
			q: address,
			format: "jsonv2",
			limit: "1",
			countrycodes: "br",
			"accept-language": "pt-BR",
		});
		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?${params.toString()}`,
			{ headers: { "User-Agent": "imeat-app" } },
		);
		const data = await res.json();
		if (!data.length) return null;
		return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
	} catch {
		return null;
	}
};
// Geocoding reverso: coordenadas → endereço via Nominatim
const reverseGeocodeNominatim = async (
	lat: number,
	lng: number,
): Promise<string | null> => {
	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`,
			{ headers: { "User-Agent": "imeat-app" } },
		);
		const data = await res.json();
		return data.display_name ?? null;
	} catch {
		return null;
	}
};

export default function AddressPickerScreen({
	isLoggedIn = false,
	onAddressConfirmed,
	onSaveAddress,
}: AddressPickerScreenProps) {
	const mapRef = useRef<MapView>(null);

	// ── Estado do mapa ──────────────────────────────────────
	const [markerCoord, setMarkerCoord] = useState({
		latitude: DEFAULT_REGION.latitude,
		longitude: DEFAULT_REGION.longitude,
	});

	// ── Busca por logradouro ────────────────────────────────
	const [searchText, setSearchText] = useState("");
	// const [searchCity, setSearchCity] = useState("Salvador");
	// const [searchState, setSearchState] = useState("BA");
	const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	// ── Busca por CEP ───────────────────────────────────────
	const [cepInput, setCepInput] = useState("");
	const [isLoadingCep, setIsLoadingCep] = useState(false);

	// ── Endereço selecionado ────────────────────────────────
	const [selectedAddress, setSelectedAddress] =
		useState<SelectedAddress | null>(null);
	const [number, setNumber] = useState("");
	const [complement, setComplement] = useState("");

	// ── Tab ativo ───────────────────────────────────────────
	const [activeTab, setActiveTab] = useState<"search" | "cep">("search");

	const animateMap = (latitude: number, longitude: number) => {
		mapRef.current?.animateToRegion(
			{
				latitude,
				longitude,
				latitudeDelta: 0.005,
				longitudeDelta: 0.005,
			},
			600,
		);
	};

	// Busca logradouro no ViaCEP com debounce
	const handleSearchChange = (text: string) => {
		setSearchText(text);
		setSuggestions([]);

		if (searchTimeout.current) clearTimeout(searchTimeout.current);
		if (text.length < 3) return;

		searchTimeout.current = setTimeout(async () => {
			setIsSearching(true);
			try {
				const params = new URLSearchParams({
					q: text,
					format: "jsonv2",
					addressdetails: "1",
					limit: "5",
					countrycodes: "br",
					"accept-language": "pt-BR",
					viewbox: "-38.65,-13.05,-38.30,-12.80",
					bounded: "0", // 0 = aceita fora do viewbox se não achar dentro
				});
				const res = await fetch(
					`https://nominatim.openstreetmap.org/search?${params.toString()}`,
					{ headers: { "User-Agent": "imeat-app" } },
				);
				const data: NominatimResult[] = await res.json();
				setSuggestions(data);
			} catch {
				setSuggestions([]);
			} finally {
				setIsSearching(false);
			}
		}, 400);
	};

	// Usuário seleciona um endereço da lista
	const handleSelectSuggestion = async (item: NominatimResult) => {
		setSuggestions([]);

		const lat = parseFloat(item.lat);
		const lng = parseFloat(item.lon);
		const addr = item.address;

		const street = addr.road ?? "";
		const neighborhood = addr.suburb ?? "";
		const city = addr.city ?? addr.town ?? "Salvador";
		const state = addr.state ?? "BA";
		const cep = addr.postcode?.replace("-", "") ?? "";

		setMarkerCoord({ latitude: lat, longitude: lng });
		setSelectedAddress({
			formatted: item.display_name,
			street,
			number: "",
			complement: "",
			neighborhood,
			city,
			state,
			cep: addr.postcode ?? "",
			latitude: lat,
			longitude: lng,
		});
		setSearchText(
			street ? `${street}, ${neighborhood}` : item.display_name,
		);
		animateMap(lat, lng);

		// Enriquecimento opcional: se tiver CEP, busca ViaCEP em background
		// para preencher logradouro oficial caso o Nominatim tenha retornado
		// um nome diferente do padrão dos Correios.
		if (cep.length === 8) {
			try {
				const res = await fetch(
					`https://viacep.com.br/ws/${cep}/json/`,
				);
				const data = await res.json();
				if (!data.erro) {
					setSelectedAddress((prev) =>
						prev
							? {
									...prev,
									street: data.logradouro || prev.street,
									neighborhood:
										data.bairro || prev.neighborhood,
									cep: data.cep ?? prev.cep,
									formatted: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
								}
							: prev,
					);
				}
			} catch {
				// silencioso — o endereço já está bom o suficiente
			}
		}
	};

	// Busca por CEP direto
	const handleCepSearch = async () => {
		const cep = cepInput.replace(/\D/g, "");
		if (cep.length !== 8) {
			Alert.alert("CEP inválido", "Digite um CEP com 8 números.");
			return;
		}

		setIsLoadingCep(true);
		try {
			const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
			const data = await res.json();

			if (data.erro) {
				Alert.alert("CEP não encontrado", "Verifique o CEP digitado.");
				return;
			}

			// Busca coords diretamente pelo CEP no Nominatim
			// É mais preciso que montar string de endereço
			const params = new URLSearchParams({
				q: cep,
				format: "jsonv2",
				limit: "1",
				countrycodes: "br",
				"accept-language": "pt-BR",
			});

			const geoRes = await fetch(
				`https://nominatim.openstreetmap.org/search?${params.toString()}`,
				{ headers: { "User-Agent": "imeat-app" } },
			);
			const geoData = await geoRes.json();

			// Fallback: se o CEP não retornar resultado, tenta pelo logradouro
			let lat: number;
			let lng: number;

			if (geoData.length > 0) {
				lat = parseFloat(geoData[0].lat);
				lng = parseFloat(geoData[0].lon);
			} else {
				const fallbackParams = new URLSearchParams({
					q: `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brasil`,
					format: "jsonv2",
					limit: "1",
					countrycodes: "br",
					"accept-language": "pt-BR",
				});
				const fallbackRes = await fetch(
					`https://nominatim.openstreetmap.org/search?${fallbackParams.toString()}`,
					{ headers: { "User-Agent": "imeat-app" } },
				);
				const fallbackData = await fallbackRes.json();

				if (fallbackData.length > 0) {
					lat = parseFloat(fallbackData[0].lat);
					lng = parseFloat(fallbackData[0].lon);
				} else {
					lat = DEFAULT_REGION.latitude;
					lng = DEFAULT_REGION.longitude;
					Alert.alert(
						"Localização aproximada",
						"Não foi possível localizar o CEP no mapa. O pin foi posicionado na região central.",
					);
				}
			}

			setMarkerCoord({ latitude: lat, longitude: lng });
			setSelectedAddress({
				formatted: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
				street: data.logradouro,
				number: "",
				complement: "",
				neighborhood: data.bairro,
				city: data.localidade,
				state: data.uf,
				cep: data.cep,
				latitude: lat,
				longitude: lng,
			});

			animateMap(lat, lng);
		} catch {
			Alert.alert(
				"Erro",
				"Não foi possível buscar o endereço. Tente novamente.",
			);
		} finally {
			setIsLoadingCep(false);
		}
	};

	// Pin arrastado → geocoding reverso pelo Nominatim
	const handleMarkerDrag = useCallback(async (e: any) => {
		const { latitude, longitude } = e.nativeEvent.coordinate;
		setMarkerCoord({ latitude, longitude });

		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&accept-language=pt-BR`,
				{ headers: { "User-Agent": "imeat-app" } },
			);
			const data = await res.json();
			if (!data.address) return;

			const addr = data.address;
			const street = addr.road ?? "";
			const neighborhood = addr.suburb ?? addr.neighbourhood ?? "";
			const city = addr.city ?? addr.town ?? "Salvador";
			const state = addr.state ?? "BA";
			const cep = addr.postcode ?? "";

			setSelectedAddress((prev) => ({
				formatted: data.display_name,
				street,
				number: prev?.number ?? "",
				complement: prev?.complement ?? "",
				neighborhood,
				city,
				state,
				cep,
				latitude,
				longitude,
			}));
		} catch {
			// mantém o endereço anterior se falhar
		}
	}, []);

	const handleConfirm = () => {
		if (!selectedAddress) {
			Alert.alert("Atenção", "Selecione um endereço antes de confirmar.");
			return;
		}
		if (!number.trim()) {
			Alert.alert("Atenção", "Informe o número do endereço.");
			return;
		}

		const finalAddress: SelectedAddress = {
			...selectedAddress,
			number: number.trim(),
			complement: complement.trim(),
			formatted: `${selectedAddress.street}, ${number.trim()}${complement ? ` - ${complement}` : ""}, ${selectedAddress.neighborhood}, ${selectedAddress.city} - ${selectedAddress.state}`,
		};

		onAddressConfirmed(finalAddress);
	};

	const formatCepInput = (text: string) => {
		const digits = text.replace(/\D/g, "").slice(0, 8);
		return digits.length > 5
			? `${digits.slice(0, 5)}-${digits.slice(5)}`
			: digits;
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAwareScrollView
				style={styles.flex}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				extraScrollHeight={20} // espaço extra acima do campo
				enableOnAndroid={true} // essencial para Android
				enableAutomaticScroll={true} // rola automaticamente até o campo focado
			>
				<ScrollView
					style={styles.flex}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					{/* HEADER */}
					<View style={styles.header}>
						<Text style={styles.headerTitle}>
							Endereço de entrega
						</Text>
						<Text style={styles.headerSubtitle}>
							Pesquise ou mova o pin para ajustar
						</Text>
					</View>
					{/* TABS */}
					<View style={styles.tabs}>
						<TouchableOpacity
							style={[
								styles.tab,
								activeTab === "search" && styles.tabActive,
							]}
							onPress={() => setActiveTab("search")}
						>
							<Text
								style={[
									styles.tabText,
									activeTab === "search" &&
										styles.tabTextActive,
								]}
							>
								🔍 Endereço
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.tab,
								activeTab === "cep" && styles.tabActive,
							]}
							onPress={() => setActiveTab("cep")}
						>
							<Text
								style={[
									styles.tabText,
									activeTab === "cep" && styles.tabTextActive,
								]}
							>
								📮 CEP
							</Text>
						</TouchableOpacity>
					</View>
					{/* BUSCA POR LOGRADOURO */}

					{activeTab === "search" && (
						<View style={styles.searchWrapper}>
							<View style={styles.searchInputWrapper}>
								<TextInput
									style={styles.searchInput}
									placeholder="Rua, bairro ou ponto de referência..."
									placeholderTextColor="#555"
									value={searchText}
									onChangeText={handleSearchChange}
								/>
								{isSearching && (
									<ActivityIndicator
										size="small"
										color="#D32F2F"
										style={styles.searchSpinner}
									/>
								)}
							</View>

							{suggestions.length > 0 && (
								<View style={styles.suggestionList}>
									{suggestions.map((item, index) => {
										const addr = item.address;
										const line1 =
											addr.road ??
											item.display_name.split(",")[0];
										const line2 = [
											addr.suburb,
											addr.city ?? addr.town,
											addr.postcode,
										]
											.filter(Boolean)
											.join(" · ");

										return (
											<TouchableOpacity
												key={item.place_id}
												style={[
													styles.suggestionRow,
													index <
														suggestions.length -
															1 &&
														styles.suggestionRowBorder,
												]}
												onPress={() =>
													handleSelectSuggestion(item)
												}
											>
												<Text
													style={
														styles.suggestionStreet
													}
												>
													{line1}
												</Text>
												<Text
													style={
														styles.suggestionDetail
													}
												>
													{line2}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>
							)}
						</View>
					)}
					{/* BUSCA POR CEP */}
					{activeTab === "cep" && (
						<View style={styles.cepWrapper}>
							<View style={styles.cepRow}>
								<TextInput
									style={styles.cepInput}
									placeholder="00000-000"
									placeholderTextColor="#555"
									keyboardType="numeric"
									value={cepInput}
									onChangeText={(text) =>
										setCepInput(formatCepInput(text))
									}
									maxLength={9}
									onSubmitEditing={handleCepSearch}
								/>
								<TouchableOpacity
									style={styles.cepButton}
									onPress={handleCepSearch}
									disabled={isLoadingCep}
								>
									{isLoadingCep ? (
										<ActivityIndicator
											color="#FFF"
											size="small"
										/>
									) : (
										<Text style={styles.cepButtonText}>
											Buscar
										</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>
					)}
					{/* MAPA */}
					<View style={styles.mapContainer}>
						<MapView
							ref={mapRef}
							style={styles.map}
							provider={PROVIDER_GOOGLE}
							initialRegion={DEFAULT_REGION}
							customMapStyle={darkMapStyle}
						>
							<Marker
								coordinate={markerCoord}
								draggable
								onDragEnd={handleMarkerDrag}
								pinColor="#D32F2F"
							/>
						</MapView>
						<View style={styles.mapHint}>
							<Text style={styles.mapHintText}>
								📍 Segure e arraste o pin para ajustar
							</Text>
						</View>
					</View>
					{/* NÚMERO E COMPLEMENTO (aparece após selecionar) */}
					{selectedAddress && (
						<View style={styles.addressCard}>
							<Text style={styles.addressCardLabel}>
								Endereço selecionado
							</Text>
							<Text style={styles.addressCardText}>
								{selectedAddress.formatted}
							</Text>

							<View style={styles.extraFieldsRow}>
								<TextInput
									style={[styles.extraInput, { width: 90 }]}
									placeholder="Número"
									placeholderTextColor="#555"
									keyboardType="numeric"
									value={number}
									onChangeText={setNumber}
								/>
								<TextInput
									style={[styles.extraInput, { flex: 1 }]}
									placeholder="Complemento (opcional)"
									placeholderTextColor="#555"
									value={complement}
									onChangeText={setComplement}
								/>
							</View>
						</View>
					)}
					{/* BOTÕES */}
					<View style={styles.footer}>
						{isLoggedIn && selectedAddress && onSaveAddress && (
							<TouchableOpacity
								style={styles.saveButton}
								onPress={() =>
									onSaveAddress({
										...selectedAddress,
										number,
										complement,
									})
								}
							>
								<Text style={styles.saveButtonText}>
									Salvar endereço
								</Text>
							</TouchableOpacity>
						)}

						<TouchableOpacity
							style={[
								styles.confirmButton,
								!selectedAddress &&
									styles.confirmButtonDisabled,
							]}
							onPress={handleConfirm}
							disabled={!selectedAddress}
						>
							<Text style={styles.confirmButtonText}>
								Confirmar endereço
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const darkMapStyle = [
	{ elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
	{ elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
	{ elementType: "labels.text.stroke", stylers: [{ color: "#0A0A0A" }] },
	{
		featureType: "road",
		elementType: "geometry",
		stylers: [{ color: "#2c2c2c" }],
	},
	{
		featureType: "road",
		elementType: "geometry.stroke",
		stylers: [{ color: "#1a1a1a" }],
	},
	{
		featureType: "road.highway",
		elementType: "geometry",
		stylers: [{ color: "#3c3c3c" }],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [{ color: "#0d1117" }],
	},
	{
		featureType: "poi",
		elementType: "geometry",
		stylers: [{ color: "#1e1e1e" }],
	},
	{
		featureType: "transit",
		elementType: "geometry",
		stylers: [{ color: "#2f3948" }],
	},
	{
		featureType: "administrative",
		elementType: "geometry",
		stylers: [{ color: "#333" }],
	},
];
