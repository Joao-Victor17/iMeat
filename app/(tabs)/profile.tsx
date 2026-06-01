import { useSession } from "@/contexts/ctx";
import { useCart } from "@/contexts/CartContext";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { profileStyles } from "@/styles/Profile/ProfileStyle";

export default function ProfileScreen() {
	const { signOut, user } = useSession();
	const { clearCart } = useCart();

	const handleLogout = () => {
		signOut();
		clearCart();
		router.replace("/login");
	};

	const handleAddress = () => {
		router.push("/profile/savedAddress");
	};

	// Gera as iniciais a partir do nome da sessão
	const initials =
		user?.first_name && user?.last_name
			? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
			: "?";

	return (
		<View style={profileStyles.container}>
			<View style={profileStyles.avatarContainer}>
				<Text style={profileStyles.avatarText}>{initials}</Text>
			</View>
			<Text style={profileStyles.name}>
				{user?.first_name && user?.last_name
					? `${user.first_name} ${user.last_name}`
					: "Sem nome"}
			</Text>
			<Text style={profileStyles.email}>
				{user?.email ?? "Sem email"}
			</Text>

			<View style={profileStyles.menu}>
				<TouchableOpacity style={profileStyles.menuItem}>
					<Text style={profileStyles.menuText}>🥩 Meus Pedidos</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={profileStyles.menuItem}
					onPress={handleAddress}
				>
					<Text style={profileStyles.menuText}>
						📍 Meus Endereços
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={profileStyles.menuItem}>
					<Text style={profileStyles.menuText}>
						💳 Métodos de Pagamento
					</Text>
				</TouchableOpacity>
				<TouchableOpacity style={profileStyles.menuItem}>
					<Text style={profileStyles.menuText}>⚙️ Configurações</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				style={profileStyles.logoutBtn}
				onPress={handleLogout}
			>
				<Text style={profileStyles.logoutText}>Sair da Conta</Text>
			</TouchableOpacity>
		</View>
	);
}
