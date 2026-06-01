import { useCart } from "@/contexts/CartContext";
import { api } from "@/services/api";
import { User } from "@/types/User";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Tipos ────────────────────────────────────────────────────────────────────

interface SavedAddress {
	id: number;
	cep: string;
	street: string;
	numberAddress: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
	formatted: string;
	latitude: number;
	longitude: number;
	is_default: boolean;
	created_at: string;
}

interface SavedAddressesScreenProps {
	user_id?: number | null;
	session?: string | null;
	onSelectAddress: (address: SavedAddress) => void;
	onBack: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatCep = (cep: string) =>
	cep.length === 8 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep;

// ── Componente principal ─────────────────────────────────────────────────────

export default function SavedAddressesScreen({
	user_id,
	session,
	onSelectAddress,
	onBack,
}: SavedAddressesScreenProps) {
	const [addresses, setAddresses] = useState<SavedAddress[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
	const { cart } = useCart();

	// ── Fetch ────────────────────────────────────────────────────────────────

	const fetchAddresses = useCallback(async () => {
		setLoading(true);
		try {
			const res = await api.get(`/address/user/${user_id}`);

			if (!res) throw new Error("Erro ao buscar endereços");

			const data: SavedAddress[] = await res.data;
			setAddresses(data);

			// Pré-seleciona o endereço padrão se existir
			const defaultAddr = data.find((a) => a.is_default);
			if (defaultAddr) setSelectedId(defaultAddr.id);
		} catch {
			Alert.alert("Erro", "Não foi possível carregar seus endereços.");
		} finally {
			setLoading(false);
		}
	}, [user_id]);

	useEffect(() => {
		fetchAddresses();
	}, [fetchAddresses]);

	// ── Ações ────────────────────────────────────────────────────────────────

	const handleSetDefault = async (address: SavedAddress) => {
		if (address.is_default) return;
		setActionLoadingId(address.id);
		try {
			const res = await fetch(
				`${apiBaseUrl}/address/${address.id}/default`,
				{
					method: "PATCH",
					headers: { Authorization: `Bearer ${authToken}` },
				},
			);
			if (!res.ok) throw new Error();
			setAddresses((prev) =>
				prev.map((a) => ({ ...a, is_default: a.id === address.id })),
			);
		} catch {
			Alert.alert("Erro", "Não foi possível definir como padrão.");
		} finally {
			setActionLoadingId(null);
		}
	};

	const handleDelete = (address: SavedAddress) => {
		Alert.alert(
			"Remover endereço",
			`Deseja remover "${address.street}, ${address.numberAddress}"?`,
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Remover",
					style: "destructive",
					onPress: async () => {
						setActionLoadingId(address.id);
						try {
							const res = await fetch(
								`${apiBaseUrl}/address/${address.id}`,
								{
									method: "DELETE",
									headers: {
										Authorization: `Bearer ${authToken}`,
									},
								},
							);
							if (!res.ok) throw new Error();
							setAddresses((prev) =>
								prev.filter((a) => a.id !== address.id),
							);
							if (selectedId === address.id) setSelectedId(null);
						} catch {
							Alert.alert(
								"Erro",
								"Não foi possível remover o endereço.",
							);
						} finally {
							setActionLoadingId(null);
						}
					},
				},
			],
		);
	};

	const handleConfirmSelection = () => {
		const selected = addresses.find((a) => a.id === selectedId);

		if (!selected) {
			Alert.alert("Atenção", "Selecione um endereço para continuar.");
			return;
		}

		// Verifica se há itens no carrinho antes de confirmar o endereço.
		// cartItems deve vir via prop ou contexto — veja nota abaixo.
		const hasCart = cart.length > 0;

		if (!hasCart) {
			Alert.alert(
				"Carrinho vazio",
				"Adicione itens ao carrinho antes de escolher um endereço de entrega.",
				[{ text: "Ok" }],
			);
			return;
		}

		Alert.alert(
			"Confirmar endereço",
			`Entregar em:\n${selected.street}, ${selected.numberAddress} — ${selected.neighborhood}, ${selected.city}`,
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Confirmar",
					onPress: () => onSelectAddress(selected),
				},
			],
		);
	};

	// ── Render item ──────────────────────────────────────────────────────────

	const renderItem = ({ item }: { item: SavedAddress }) => {
		const isSelected = selectedId === item.id;
		const isLoading = actionLoadingId === item.id;

		return (
			<TouchableOpacity
				style={[styles.card, isSelected && styles.cardSelected]}
				onPress={() => setSelectedId(item.id)}
				activeOpacity={0.8}
			>
				{/* Linha superior: rádio + rua + badge padrão */}
				<View style={styles.cardHeader}>
					<View
						style={[
							styles.radio,
							isSelected && styles.radioSelected,
						]}
					>
						{isSelected && <View style={styles.radioDot} />}
					</View>

					<View style={styles.cardHeaderText}>
						<Text style={styles.streetText} numberOfLines={1}>
							{item.street}, {item.numberAddress}
							{item.complement ? ` — ${item.complement}` : ""}
						</Text>
						{item.is_default && (
							<View style={styles.defaultBadge}>
								<Text style={styles.defaultBadgeText}>
									Padrão
								</Text>
							</View>
						)}
					</View>
				</View>

				{/* Detalhes */}
				<View style={styles.cardBody}>
					<Text style={styles.detailText}>
						{item.neighborhood} · {item.city} - {item.state}
					</Text>
					<Text style={styles.cepText}>
						CEP {formatCep(item.cep)}
					</Text>
				</View>

				{/* Ações */}
				<View style={styles.cardActions}>
					{isLoading ? (
						<ActivityIndicator
							size="small"
							color="#D32F2F"
							style={{ marginLeft: 8 }}
						/>
					) : (
						<>
							{!item.is_default && (
								<TouchableOpacity
									style={styles.actionBtn}
									onPress={() => handleSetDefault(item)}
								>
									<Text style={styles.actionBtnText}>
										Definir padrão
									</Text>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={[
									styles.actionBtn,
									styles.actionBtnDanger,
								]}
								onPress={() => handleDelete(item)}
							>
								<Text style={styles.actionBtnTextDanger}>
									Remover
								</Text>
							</TouchableOpacity>
						</>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	// ── Layout ───────────────────────────────────────────────────────────────

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={onBack}
					style={styles.backBtn}
					hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
				>
					<Text style={styles.backBtnText}>←</Text>
				</TouchableOpacity>
				<View>
					<Text style={styles.headerTitle}>Meus endereços</Text>
					<Text style={styles.headerSubtitle}>
						{addresses.length} endereço
						{addresses.length !== 1 ? "s" : ""} salvo
						{addresses.length !== 1 ? "s" : ""}
					</Text>
				</View>
			</View>

			{/* Lista */}
			{loading ? (
				<View style={styles.centered}>
					<ActivityIndicator size="large" color="#D32F2F" />
					<Text style={styles.loadingText}>
						Carregando endereços...
					</Text>
				</View>
			) : addresses.length === 0 ? (
				<View style={styles.centered}>
					<Text style={styles.emptyIcon}>📍</Text>
					<Text style={styles.emptyTitle}>Nenhum endereço salvo</Text>
					<Text style={styles.emptySubtitle}>
						Seus endereços confirmados aparecerão aqui
					</Text>
				</View>
			) : (
				<FlatList
					data={addresses}
					keyExtractor={(item) => String(item.id)}
					renderItem={renderItem}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
					ItemSeparatorComponent={() => (
						<View style={styles.separator} />
					)}
				/>
			)}

			{/* Botão confirmar */}
			{!loading && addresses.length > 0 && (
				<View style={styles.footer}>
					<TouchableOpacity
						style={[
							styles.confirmBtn,
							!selectedId && styles.confirmBtnDisabled,
						]}
						onPress={handleConfirmSelection}
						disabled={!selectedId}
					>
						<Text style={styles.confirmBtnText}>
							Usar este endereço
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</SafeAreaView>
	);
}

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
	},

	// Header
	header: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#1C1C1C",
	},
	backBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: "#1A1A1A",
		alignItems: "center",
		justifyContent: "center",
	},
	backBtnText: {
		color: "#FFF",
		fontSize: 18,
		lineHeight: 22,
	},
	headerTitle: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "700",
	},
	headerSubtitle: {
		color: "#555",
		fontSize: 12,
		marginTop: 2,
	},

	// Lista
	list: {
		padding: 16,
		paddingBottom: 100,
	},
	separator: {
		height: 10,
	},

	// Card
	card: {
		backgroundColor: "#111111",
		borderRadius: 12,
		padding: 16,
		borderWidth: 1,
		borderColor: "#1C1C1C",
	},
	cardSelected: {
		borderColor: "#D32F2F",
		backgroundColor: "#130000",
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 10,
		marginBottom: 8,
	},
	cardHeaderText: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 8,
	},
	streetText: {
		color: "#EEEEEE",
		fontSize: 15,
		fontWeight: "600",
		flex: 1,
	},
	defaultBadge: {
		backgroundColor: "#1A0000",
		borderWidth: 1,
		borderColor: "#D32F2F",
		borderRadius: 4,
		paddingHorizontal: 6,
		paddingVertical: 2,
	},
	defaultBadgeText: {
		color: "#D32F2F",
		fontSize: 10,
		fontWeight: "700",
		letterSpacing: 0.5,
	},
	cardBody: {
		marginLeft: 34,
		gap: 2,
	},
	detailText: {
		color: "#888",
		fontSize: 13,
	},
	cepText: {
		color: "#555",
		fontSize: 12,
	},
	cardActions: {
		flexDirection: "row",
		gap: 8,
		marginTop: 14,
		marginLeft: 34,
	},
	actionBtn: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		borderWidth: 1,
		borderColor: "#2A2A2A",
		backgroundColor: "#1A1A1A",
	},
	actionBtnText: {
		color: "#AAAAAA",
		fontSize: 12,
		fontWeight: "500",
	},
	actionBtnDanger: {
		borderColor: "#3A1010",
		backgroundColor: "#1A0808",
	},
	actionBtnTextDanger: {
		color: "#D32F2F",
		fontSize: 12,
		fontWeight: "500",
	},

	// Rádio
	radio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#333",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 1,
	},
	radioSelected: {
		borderColor: "#D32F2F",
	},
	radioDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#D32F2F",
	},

	// Estados
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 12,
		paddingHorizontal: 40,
	},
	loadingText: {
		color: "#555",
		fontSize: 14,
		marginTop: 8,
	},
	emptyIcon: {
		fontSize: 48,
	},
	emptyTitle: {
		color: "#EEEEEE",
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
	},
	emptySubtitle: {
		color: "#555",
		fontSize: 14,
		textAlign: "center",
		lineHeight: 20,
	},

	// Footer
	footer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		padding: 16,
		paddingBottom: 32,
		backgroundColor: "#0A0A0A",
		borderTopWidth: 1,
		borderTopColor: "#1C1C1C",
	},
	confirmBtn: {
		backgroundColor: "#D32F2F",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
	},
	confirmBtnDisabled: {
		backgroundColor: "#1A0000",
	},
	confirmBtnText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
});
