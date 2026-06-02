import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	SafeAreaView,
	FlatList,
	ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/contexts/ctx";
import { api } from "@/services/api";

// Tipagem baseada no seu endpoint findById
interface OrderDetails {
	id: number;
	status: string;
	total: string;
	order_items: any[];
}

interface Address {
	formatted: string;
	street: string;
	numberAddress?: string;
	neighborhood: string;
	city: string;
	state: string;
	cep: string;
	latitude: number;
	longitude: number;
}

export default function ResumoPedidoScreen() {
	const router = useRouter();
	const { cart, totalPrice } = useCart();
	const { user, session } = useSession();
	const { address_id } = useLocalSearchParams();

	const [address, setAddress] = useState<Address | null>(null);
	const [isLoadingAddress, setIsLoadingAddress] = useState(false);

	const [isProcessingPayment, setIsProcessingPayment] = useState(false);

	const fetchAddress = async () => {
		if (!address_id) return;

		setIsLoadingAddress(true);
		try {
			const response = await api.get(`/address/${address_id}`, {
				headers: {
					Authorization: session,
				},
			});
			setAddress(response.data);
		} catch {
			Alert.alert("Erro", "Ocorreu um erro ao buscar o endereço.");
		} finally {
			setIsLoadingAddress(false);
		}
	};

	useEffect(() => {
		fetchAddress();
	}, [address_id]);

	const handleOrder = async () => {
		setIsProcessingPayment(true);
		try {
			const response = await api.post(
				"/order",
				{
					items: cart.map((item) => ({
						product_id: Number(item.id),
						quantity: item.quantity,
					})),
					user_id: user?.user_id,
					address_id: Number(address_id),
				},
				{ headers: { Authorization: session } },
			);

			router.push({
				pathname: "/order/choose_payment",
				params: { order_id: response.data.id },
			});
		} catch {
			Alert.alert("Erro", "Ocorreu um erro ao processar o pagamento.");
		} finally {
			setIsProcessingPayment(false);
		}
	};

	return (
		// Troque o SafeAreaView + card pela estrutura abaixo

		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Resumo do Pedido</Text>

			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{ paddingBottom: 20 }}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.card}>
					{/* Endereço */}
					<Text style={styles.itemsHeader}>Entregar em:</Text>
					{isLoadingAddress ? (
						<ActivityIndicator color="#D32F2F" size="small" />
					) : address ? (
						<View style={{ gap: 2 }}>
							<Text style={styles.itemText}>
								{address.street}, {address.numberAddress}
							</Text>
							<Text style={styles.itemText}>
								{address.neighborhood} · {address.city} -{" "}
								{address.state}
							</Text>
							<Text style={[styles.itemText, { color: "#555" }]}>
								CEP {address.cep}
							</Text>
						</View>
					) : (
						<Text style={styles.itemText}>
							Endereço não encontrado
						</Text>
					)}

					<View style={styles.divider} />

					{/* Itens — sem FlatList */}
					<Text style={styles.itemsHeader}>Itens:</Text>
					{cart.map((item) => (
						<View key={item.id.toString()} style={styles.itemRow}>
							<Text style={styles.itemText}>
								{item.quantity}x {item.name}
							</Text>
							<Text style={styles.itemPrice}>
								R$
								{(item.price * item.quantity)
									.toFixed(2)
									.replace(".", ",")}
							</Text>
						</View>
					))}

					<View style={styles.divider} />

					<View style={styles.totalRow}>
						<Text style={styles.totalLabel}>Total a pagar:</Text>
						<Text style={styles.totalValue}>
							R${totalPrice.toFixed(2).replace(".", ",")}
						</Text>
					</View>
				</View>
			</ScrollView>

			{/* Botão fixo no rodapé */}
			<TouchableOpacity
				style={styles.payBtn}
				onPress={handleOrder}
				disabled={isProcessingPayment}
			>
				{isProcessingPayment ? (
					<ActivityIndicator color="#FFFFFF" size="small" />
				) : (
					<Text style={styles.payBtnText}>
						Seguir para o pagamento
					</Text>
				)}
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0A0A0A", padding: 20 },
	centered: { justifyContent: "center", alignItems: "center" },
	header: {
		color: "#FFF",
		fontSize: 22,
		fontWeight: "bold",
		marginVertical: 20,
		textAlign: "center",
	},
	card: {
		backgroundColor: "#1E1E1E",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
	},
	statusLabel: { color: "#888", fontSize: 14 },
	statusValue: {
		color: "#FFD700",
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 4,
	},
	divider: { height: 1, backgroundColor: "#333", marginVertical: 15 },
	itemsHeader: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 10,
	},
	itemRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	itemText: { color: "#CCC", fontSize: 14, flex: 1 },
	itemPrice: { color: "#FFF", fontSize: 14, fontWeight: "500" },
	totalRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 10,
	},
	totalLabel: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
	totalValue: { color: "#D32F2F", fontSize: 22, fontWeight: "bold" },
	payBtn: {
		backgroundColor: "#009EE3",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 20,
	}, // Azul padrão do MP
	payBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
