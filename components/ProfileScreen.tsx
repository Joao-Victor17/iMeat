import { useSession } from "@/app/ctx";
import { useCart } from "@/components/CartContext";
import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
	const { signOut, user, guest, isGuest } = useSession();
	const { clearCart } = useCart();

	const handleLogout = () => {
		signOut();
		clearCart();
		router.replace("/login");
	};
	//
	// Gera as iniciais a partir do nome da sessão
	const initials = user?.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
		: "?";

	return (
		<View style={styles.container}>
			<View style={styles.avatarContainer}>
				<Text style={styles.avatarText}>
					{isGuest ? "U" : initials}
				</Text>
			</View>
			<Text style={styles.name}>
				{isGuest ? guest?.name : user?.name}
			</Text>
			<Text style={styles.email}>
				{isGuest ? "Sem email" : user?.email}
			</Text>

			<View style={styles.menu}>
				<TouchableOpacity style={styles.menuItem}>
					<Text style={styles.menuText}>🥩 Meus Pedidos</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuItem}>
					<Text style={styles.menuText}>📍 Meus Endereços</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuItem}>
					<Text style={styles.menuText}>💳 Métodos de Pagamento</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.menuItem}>
					<Text style={styles.menuText}>⚙️ Configurações</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
				<Text style={styles.logoutText}>Sair da Conta</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
		padding: 20,
		alignItems: "center",
	},
	avatarContainer: {
		width: 90,
		height: 90,
		borderRadius: 45,
		backgroundColor: "#D32F2F",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
		marginBottom: 15,
	},
	avatarText: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
	name: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
	email: { color: "#888", fontSize: 14, marginBottom: 40 },
	menu: { width: "100%" },
	menuItem: {
		backgroundColor: "#1E1E1E",
		padding: 18,
		borderRadius: 10,
		marginBottom: 10,
	},
	menuText: { color: "#FFF", fontSize: 16, fontWeight: "500" },
	logoutBtn: { marginTop: "auto", marginBottom: 20, padding: 10 },
	logoutText: { color: "#D32F2F", fontSize: 16, fontWeight: "bold" },
});
