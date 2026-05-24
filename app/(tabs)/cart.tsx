import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "@/contexts/ctx";
import { handleCheckout } from "@/services/order.service";
import { styles } from "@/styles/Cart/CartStyles";
import { ProductsCart } from "@/components/Cart/ProductsCart";
import { FooterCart } from "@/components/Cart/FooterCart";

export default function CarrinhoScreen() {
	const { cart, addToCart, removeFromCart, totalPrice } = useCart();
	const { session, user, guest, isGuest } = useSession();
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Seu Pedido</Text>

			{cart.length === 0 ? (
				<Text style={styles.empty}>Seu carrinho está vazio.</Text>
			) : (
				<ProductsCart
					cart={cart}
					removeFromCart={removeFromCart}
					addToCart={addToCart}
				/>
			)}

			<FooterCart totalPrice={totalPrice} />

			<TouchableOpacity
				style={[
					styles.checkoutBtn,
					cart.length === 0 && styles.disabledBtn,
				]}
				disabled={cart.length === 0 || isCheckingOut}
				onPress={() =>
					handleCheckout({
						setIsCheckingOut,
						user,
						session,
						guest,
						isGuest,
						cart,
					})
				}
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
