import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { useSession } from "../contexts/ctx";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const DOC_TYPES = ["CPF", "CNPJ"];

export default function GuestScreen() {
	const { registerUser, signIn } = useSession();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [docType, setDocType] = useState<"CPF" | "CNPJ">("CPF");
	const [docNumber, setDocNumber] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState<string | null>(null);

	// ── Formatters ────────────────────────────────────────────────
	const formatPhone = (value: string) => {
		const digits = value.replace(/\D/g, "").slice(0, 11);
		if (digits.length <= 10)
			return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
		return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
	};

	const formatCPF = (value: string) => {
		const digits = value.replace(/\D/g, "").slice(0, 11);
		return digits
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
	};

	const formatCNPJ = (value: string) => {
		const digits = value.replace(/\D/g, "").slice(0, 14);
		return digits
			.replace(/(\d{2})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1/$2")
			.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
	};

	const handleDocChange = (value: string) => {
		setDocNumber(docType === "CPF" ? formatCPF(value) : formatCNPJ(value));
		setError(null);
	};

	const handleDocTypeChange = (type: "CPF" | "CNPJ") => {
		setDocType(type);
		setDocNumber("");
	};

	// ── Validation ────────────────────────────────────────────────
	const validate = (): boolean => {
		if (!firstName.trim()) {
			setError("Por favor, informe seu nome.");
			return false;
		}
		if (!lastName.trim()) {
			setError("Por favor, informe seu sobrenome.");
			return false;
		}
		if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError("Por favor, informe um e-mail válido.");
			return false;
		}
		if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
			setError("Por favor, informe um telefone válido.");
			return false;
		}
		const rawDoc = docNumber.replace(/\D/g, "");
		if (docType === "CPF" && rawDoc.length !== 11) {
			setError("CPF deve ter 11 dígitos.");
			return false;
		}
		if (docType === "CNPJ" && rawDoc.length !== 14) {
			setError("CNPJ deve ter 14 dígitos.");
			return false;
		}
		if (!password.trim()) {
			setError("Por favor, informe uma senha.");
			return false;
		}
		if (password.trim().length < 6) {
			setError("A senha deve ter pelo menos 6 caracteres.");
			return false;
		}
		return true;
	};

	const handleRegister = async () => {
		if (!validate()) return;

		const registerResult = await registerUser(
			firstName.trim(),
			lastName.trim(),
			email.trim(),
			phone.replace(/\D/g, ""),
			docType,
			docNumber.replace(/\D/g, ""),
			password.trim(),
		);
		if (registerResult?.error) {
			setError(registerResult.error);
			return;
		}

		// ✅ Login automático após cadastro bem-sucedido
		const signInResult = await signIn(email.trim(), password);

		if (signInResult?.error) {
			setError(signInResult.error);
			return;
		}

		router.replace("/");
	};

	// ── UI ────────────────────────────────────────────────────────
	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAwareScrollView
				style={styles.flex}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				extraScrollHeight={20} // espaço extra acima do campo
				enableOnAndroid={true} // essencial para Android
				enableAutomaticScroll={true} // rola automaticamente até o campo focado
			>
				<ScrollView
					contentContainerStyle={styles.form}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<Text style={styles.title}>Realizar cadastro</Text>

					{error && (
						<View style={styles.errorBox}>
							<Text style={styles.errorText}>{error}</Text>
						</View>
					)}

					{/* Nome e Sobrenome lado a lado */}
					<View style={styles.row}>
						<View style={styles.flex}>
							<Text style={styles.label}>Nome</Text>
							<TextInput
								style={styles.input}
								placeholder="João"
								placeholderTextColor="#555"
								value={firstName}
								onChangeText={(v) => {
									setFirstName(v);
									setError(null);
								}}
							/>
						</View>
						<View style={styles.rowSpacer} />
						<View style={styles.flex}>
							<Text style={styles.label}>Sobrenome</Text>
							<TextInput
								style={styles.input}
								placeholder="Silva"
								placeholderTextColor="#555"
								value={lastName}
								onChangeText={(v) => {
									setLastName(v);
									setError(null);
								}}
							/>
						</View>
					</View>

					<Text style={styles.label}>E-mail</Text>
					<TextInput
						style={styles.input}
						placeholder="joao@email.com"
						placeholderTextColor="#555"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={(v) => {
							setEmail(v);
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

					{/* Tipo de documento */}
					<Text style={styles.label}>Tipo de documento</Text>
					<View style={styles.segmentRow}>
						{DOC_TYPES.map((type) => (
							<TouchableOpacity
								key={type}
								style={[
									styles.segmentButton,
									docType === type &&
										styles.segmentButtonActive,
								]}
								onPress={() =>
									handleDocTypeChange(type as "CPF" | "CNPJ")
								}
							>
								<Text
									style={[
										styles.segmentText,
										docType === type &&
											styles.segmentTextActive,
									]}
								>
									{type}
								</Text>
							</TouchableOpacity>
						))}
					</View>

					<Text style={styles.label}>
						{docType === "CPF" ? "CPF" : "CNPJ"}
					</Text>
					<TextInput
						style={styles.input}
						placeholder={
							docType === "CPF"
								? "000.000.000-00"
								: "00.000.000/0000-00"
						}
						placeholderTextColor="#555"
						keyboardType="numeric"
						value={docNumber}
						onChangeText={handleDocChange}
					/>

					<Text style={styles.label}>Senha</Text>
					<TextInput
						style={styles.input}
						placeholder="Digite sua senha"
						placeholderTextColor="#555"
						value={password}
						onChangeText={(v) => {
							setPassword(v);
							setError(null);
						}}
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={handleRegister}
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
				</ScrollView>
			</KeyboardAwareScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	flex: { flex: 1 },
	container: { flex: 1, backgroundColor: "#0A0A0A" },
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
	form: { padding: 24, paddingBottom: 40 },
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
	row: { flexDirection: "row", marginBottom: 0 },
	rowSpacer: { width: 12 },
	segmentRow: {
		flexDirection: "row",
		marginBottom: 16,
		backgroundColor: "#1E1E1E",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#2A2A2A",
		overflow: "hidden",
	},
	segmentButton: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
	},
	segmentButtonActive: {
		backgroundColor: "#D32F2F",
	},
	segmentText: {
		color: "#888",
		fontWeight: "600",
		fontSize: 14,
	},
	segmentTextActive: {
		color: "#FFF",
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
