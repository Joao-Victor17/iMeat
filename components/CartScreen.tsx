import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useCart } from "./CartContext";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import { getOrCreateGuestId } from "@/services/guest_id";

export default function CarrinhoScreen() {
	const { cart, addToCart, removeFromCart, totalPrice } = useCart();
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const router = useRouter(); // Instanciando o roteador do Expo

	const handleCheckout = async () => {
		setIsCheckingOut(true);

		try {
			const guest_id = getOrCreateGuestId();

			const orderPayload = {
				items: cart.map((item) => ({
					product_id: Number(item.id),
					quantity: item.quantity,
				})),
				guest_id: guest_id,
				guest_name: "João Teste",
				guest_email: "test_user@testuser.com",
				guest_phone: "71999999999",
			};

			// 1. Gera APENAS a Ordem (Etapa 1)
			// 1. Cria a Ordem (O Axios já faz o stringify e já retorna o JSON em 'data')
			console.log(guest_id);
			const { data: order } = await api.post("/order", orderPayload);

			// 2. Redireciona para a tela de Resumo passando o ID da ordem criada
			router.push(`/order/resume?order_id=${order.id}`);
		} catch (error: any) {
			console.error(error);
			Alert.alert(
				"Aviso",
				error.message || "Não foi possível gerar o pedido.",
			);
		} finally {
			setIsCheckingOut(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Seu Pedido</Text>

			{cart.length === 0 ? (
				<Text style={styles.empty}>Seu carrinho está vazio.</Text>
			) : (
				<FlatList
					data={cart}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<View style={styles.cartItem}>
							<View style={styles.info}>
								<Text style={styles.name}>{item.name}</Text>
								<Text style={styles.price}>
									R${" "}
									{(item.price * item.quantity)
										.toFixed(2)
										.replace(".", ",")}
								</Text>
							</View>

							<View style={styles.controls}>
								<TouchableOpacity
									style={styles.controlBtn}
									onPress={() => removeFromCart(item.id)}
								>
									<Text style={styles.controlText}>-</Text>
								</TouchableOpacity>
								<Text style={styles.quantity}>
									{item.quantity}
								</Text>
								<TouchableOpacity
									style={[
										styles.controlBtn,
										item.quantity >= item.stock &&
											styles.disabledBtn,
									]}
									onPress={() => addToCart(item)}
									disabled={item.quantity >= item.stock}
								>
									<Text style={styles.controlText}>+</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				/>
			)}

			<View style={styles.footer}>
				<Text style={styles.totalText}>Total:</Text>
				<Text style={styles.totalPrice}>
					R$ {totalPrice.toFixed(2).replace(".", ",")}
				</Text>
			</View>

			<TouchableOpacity
				style={[
					styles.checkoutBtn,
					cart.length === 0 && styles.disabledBtn,
				]}
				disabled={cart.length === 0 || isCheckingOut}
				onPress={handleCheckout}
			>
				{isCheckingOut ? (
					<Text style={styles.checkoutText}>Processando...</Text> // <-- Texto alterado
				) : (
					<Text style={styles.checkoutText}>Finalizar pedido</Text> // <-- Texto alterado
				)}
			</TouchableOpacity>
		</View>
	);
}

// ... manter os mesmos styles de antes
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
		padding: 20,
		paddingBottom: 110,
	},
	header: {
		color: "#FFF",
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
	},
	empty: { color: "#777", fontSize: 16, textAlign: "center", marginTop: 50 },
	cartItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#1E1E1E",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		alignItems: "center",
	},
	info: { flex: 1 },
	name: { color: "#FFF", fontSize: 16 },
	price: { color: "#D32F2F", fontSize: 14, fontWeight: "bold", marginTop: 5 },
	controls: { flexDirection: "row", alignItems: "center" },
	controlBtn: {
		backgroundColor: "#333",
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
	},
	disabledBtn: { opacity: 0.5 },
	controlText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
	quantity: { color: "#FFF", marginHorizontal: 15, fontSize: 16 },
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
		paddingVertical: 15,
		borderTopWidth: 1,
		borderColor: "#333",
	},
	totalText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
	totalPrice: { color: "#D32F2F", fontSize: 22, fontWeight: "bold" },
	checkoutBtn: {
		backgroundColor: "#D32F2F",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	checkoutText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
