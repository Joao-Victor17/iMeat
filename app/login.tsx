import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import { useSession } from "../contexts/ctx";
import { router } from "expo-router";

export default function Login() {
	const { signIn } = useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			setError("Preencha o email e a senha.");
			return;
		}

		setError(null);
		setIsLoading(true);

		const result = await signIn(email, password);

		setIsLoading(false);

		if (result.error) {
			setError(result.error);
			return;
		}

		router.replace("/");
	};

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.inner}
			>
				{/* FORMULÁRIO */}
				<View style={styles.form}>
					<Text style={styles.title}>Entrar na conta</Text>
					<Text style={styles.subtitle}>
						Acesse para ver nossos produtos e pedidos
					</Text>

					{error && (
						<View style={styles.errorBox}>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}

					<Text style={styles.label}>Email</Text>
					<TextInput
						style={styles.input}
						placeholder="seu@email.com"
						placeholderTextColor="#555"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
					/>

					<Text style={styles.label}>Senha</Text>
					<TextInput
						style={styles.input}
						placeholder="••••••••"
						placeholderTextColor="#555"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
					/>

					<TouchableOpacity
						style={[
							styles.button,
							isLoading && styles.buttonDisabled,
						]}
						onPress={handleLogin}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator color="#FFF" />
						) : (
							<Text style={styles.buttonText}>Entrar</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.guestButton}
						onPress={() => router.push("/register")}
					>
						<Text style={styles.guestButtonText}>
							Não tem cadastro? Clique aqui!
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
	},
	inner: {
		flex: 1,
	},
	header: {
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: "#121212",
		borderBottomWidth: 1,
		borderBottomColor: "#2A2A2A",
		marginTop: 30,
	},
	logoText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	logoAccent: {
		color: "#D32F2F",
	},
	form: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		color: "#FFFFFF",
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		color: "#888",
		marginBottom: 32,
	},
	label: {
		color: "#AAA",
		fontSize: 13,
		marginBottom: 6,
		fontWeight: "500",
	},
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
	errorText: {
		color: "#FF6B6B",
		fontSize: 14,
	},
	button: {
		backgroundColor: "#D32F2F",
		paddingVertical: 16,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 8,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
	},
	guestButton: {
		alignItems: "center",
		marginTop: 16,
		padding: 10,
	},
	guestButtonText: {
		color: "#888",
		fontSize: 14,
		textDecorationLine: "underline",
	},
});
