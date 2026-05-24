import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useSession } from "../contexts/ctx";
import { router } from "expo-router";

export default function GuestScreen() {
	const { signInAsGuest } = useSession();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleContinue = () => {
		if (!name.trim()) {
			setError("Por favor, informe seu nome.");
			return;
		}
		if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
			setError("Por favor, informe um telefone válido.");
			return;
		}

		signInAsGuest(name.trim(), phone.replace(/\D/g, ""));
		router.replace("/");
	};

	const formatPhone = (value: string) => {
		const digits = value.replace(/\D/g, "").slice(0, 11);
		if (digits.length <= 10) {
			return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
		}
		return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.inner}
			>
				{/* HEADER */}
				<View style={styles.header}>
					<Text style={styles.logoText}>
						I MEAT <Text style={styles.logoAccent}>PRIME</Text>
					</Text>
				</View>

				<View style={styles.form}>
					<Text style={styles.title}>Continuar sem cadastro</Text>

					{/* Aviso de privacidade */}
					<View style={styles.infoBox}>
						<Text style={styles.infoText}>
							ℹ️ Essas informações são usadas apenas para
							identificar seu pedido e entrar em contato se
							necessário.{" "}
							<Text style={styles.infoTextBold}>
								Elas não ficam salvas após você fechar o
								aplicativo.
							</Text>
						</Text>
					</View>

					{error && (
						<View style={styles.errorBox}>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}

					<Text style={styles.label}>Seu nome</Text>
					<TextInput
						style={styles.input}
						placeholder="Como devemos te chamar?"
						placeholderTextColor="#555"
						value={name}
						onChangeText={(v) => {
							setName(v);
							setError(null);
						}}
					/>

					<Text style={styles.label}>WhatsApp / Telefone</Text>
					<TextInput
						style={styles.input}
						placeholder="(71) 99999-9999"
						placeholderTextColor="#555"
						keyboardType="phone-pad"
						value={phone}
						onChangeText={(v) => {
							setPhone(formatPhone(v));
							setError(null);
						}}
					/>

					<TouchableOpacity
						style={styles.button}
						onPress={handleContinue}
					>
						<Text style={styles.buttonText}>Continuar</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.backButton}
						onPress={() => router.back()}
					>
						<Text style={styles.backButtonText}>
							← Voltar para o login
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0A0A0A" },
	inner: { flex: 1 },
	header: {
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: "#121212",
		borderBottomWidth: 1,
		borderBottomColor: "#2A2A2A",
		marginTop: 30,
	},
	logoText: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF" },
	logoAccent: { color: "#D32F2F" },
	form: { flex: 1, padding: 24, justifyContent: "center" },
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 16,
	},
	infoBox: {
		backgroundColor: "#1A1A2E",
		borderWidth: 1,
		borderColor: "#2A2A4A",
		borderRadius: 8,
		padding: 14,
		marginBottom: 24,
	},
	infoText: { color: "#AAA", fontSize: 13, lineHeight: 20 },
	infoTextBold: { color: "#CCC", fontWeight: "bold" },
	label: { color: "#AAA", fontSize: 13, marginBottom: 6, fontWeight: "500" },
	input: {
		backgroundColor: "#1E1E1E",
		borderWidth: 1,
		borderColor: "#2A2A2A",
		borderRadius: 8,
		padding: 14,
		color: "#FFF",
		fontSize: 15,
		marginBottom: 16,
	},
	errorBox: {
		backgroundColor: "#3B0000",
		borderWidth: 1,
		borderColor: "#D32F2F",
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
	},
	errorText: { color: "#FF6B6B", fontSize: 14 },
	button: {
		backgroundColor: "#D32F2F",
		paddingVertical: 16,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 8,
	},
	buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
	backButton: { alignItems: "center", marginTop: 20 },
	backButtonText: { color: "#888", fontSize: 14 },
});
