import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Image,
	Clipboard,
	Alert,
	ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/services/api";
import { useCart } from "@/contexts/CartContext";

const POLLING_INTERVAL_MS = 5000; // verifica o status a cada 5s

export default function PixPaymentScreen() {
	const { order_id, pix_copy_paste, pix_qr_code, expires_at } =
		useLocalSearchParams<{
			order_id: string;
			pix_copy_paste: string;
			pix_qr_code: string;
			expires_at: string;
		}>();

	const { clearCart } = useCart();
	const router = useRouter();
	const [copied, setCopied] = useState(false);
	const [timeLeft, setTimeLeft] = useState<string>("");
	const [expired, setExpired] = useState(false);
	const [isChecking, setIsChecking] = useState(false);

	// ── Timer de expiração ──────────────────────────────────────────────────
	useEffect(() => {
		if (!expires_at) return;

		const expiresDate = new Date(expires_at);

		const tick = () => {
			const diff = expiresDate.getTime() - Date.now();
			if (diff <= 0) {
				setExpired(true);
				setTimeLeft("Expirado");
				return;
			}
			const m = Math.floor(diff / 60000);
			const s = Math.floor((diff % 60000) / 1000);
			setTimeLeft(`${m}:${s.toString().padStart(2, "0")}`);
		};

		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [expires_at]);

	// ── Polling de status ───────────────────────────────────────────────────
	useEffect(() => {
		if (expired) return;

		const check = async () => {
			try {
				const { data } = await api.get(`/order/${order_id}`);
				const payment = data.payments?.[0];

				if (payment?.status === "COMPLETED") {
					clearCart();
					router.replace(`/order/success?order_id=${order_id}`);
				}
			} catch (_) {}
		};

		const interval = setInterval(check, POLLING_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [expired, order_id]);

	// ── Copiar código ───────────────────────────────────────────────────────
	const handleCopy = () => {
		Clipboard.setString(pix_copy_paste);
		setCopied(true);
		setTimeout(() => setCopied(false), 3000);
	};

	// ── Verificar manualmente ───────────────────────────────────────────────
	const handleCheckStatus = async () => {
		setIsChecking(true);
		try {
			const { data } = await api.get(`/order/${order_id}`);
			const payment = data.payments?.[0];

			if (payment?.status === "COMPLETED") {
				clearCart();
				router.replace(`/order/success?order_id=${order_id}`);
			} else {
				Alert.alert(
					"Aguardando pagamento",
					"Ainda não identificamos seu pagamento. Tente novamente em instantes.",
				);
			}
		} catch (_) {
			Alert.alert("Erro", "Não foi possível verificar o pagamento.");
		} finally {
			setIsChecking(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* HEADER */}
			<View style={styles.header}>
				<Text style={styles.logoText}>
					I MEAT <Text style={styles.logoAccent}>PRIME</Text>
				</Text>
			</View>

			<View style={styles.content}>
				<Text style={styles.title}>Pague com PIX</Text>
				<Text style={styles.subtitle}>
					Escaneie o QR code ou copie o código abaixo
				</Text>

				{/* TIMER */}
				<View
					style={[
						styles.timerBadge,
						expired && styles.timerBadgeExpired,
					]}
				>
					<Text style={styles.timerIcon}>⏱</Text>
					<Text
						style={[
							styles.timerText,
							expired && styles.timerTextExpired,
						]}
					>
						{expired ? "PIX expirado" : `Expira em ${timeLeft}`}
					</Text>
				</View>

				{/* QR CODE */}
				{pix_qr_code && !expired ? (
					<View style={styles.qrContainer}>
						<Image
							source={{
								uri: `data:image/png;base64,${pix_qr_code}`,
							}}
							style={styles.qrImage}
							resizeMode="contain"
						/>
					</View>
				) : expired ? (
					<View style={styles.expiredBox}>
						<Text style={styles.expiredText}>
							Este PIX expirou. Volte e gere um novo pagamento.
						</Text>
					</View>
				) : null}

				{/* COPIA E COLA */}
				{!expired && (
					<>
						<Text style={styles.copyLabel}>Ou copie o código:</Text>
						<View style={styles.copyBox}>
							<Text style={styles.copyCode} numberOfLines={2}>
								{pix_copy_paste}
							</Text>
						</View>

						<TouchableOpacity
							style={[
								styles.copyBtn,
								copied && styles.copyBtnSuccess,
							]}
							onPress={handleCopy}
						>
							<Text style={styles.copyBtnText}>
								{copied ? "✓ Copiado!" : "Copiar código PIX"}
							</Text>
						</TouchableOpacity>
					</>
				)}

				{/* INFO */}
				<View style={styles.infoBox}>
					<Text style={styles.infoText}>
						ℹ️ Após o pagamento, a confirmação pode levar alguns
						segundos. Aguarde nesta tela.
					</Text>
				</View>

				{/* VERIFICAR MANUALMENTE */}
				{!expired && (
					<TouchableOpacity
						style={styles.checkBtn}
						onPress={handleCheckStatus}
						disabled={isChecking}
					>
						{isChecking ? (
							<ActivityIndicator color="#32C77F" size="small" />
						) : (
							<Text style={styles.checkBtnText}>
								Já paguei — verificar
							</Text>
						)}
					</TouchableOpacity>
				)}

				{/* VOLTAR */}
				{expired && (
					<TouchableOpacity
						style={styles.backBtn}
						onPress={() => router.back()}
					>
						<Text style={styles.backBtnText}>
							Voltar e tentar novamente
						</Text>
					</TouchableOpacity>
				)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
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
	content: { flex: 1, padding: 24, alignItems: "center" },
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#FFF",
		marginTop: 10,
		marginBottom: 6,
	},
	subtitle: {
		color: "#888",
		fontSize: 14,
		textAlign: "center",
		marginBottom: 20,
	},
	timerBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1A3A2A",
		borderRadius: 20,
		paddingVertical: 6,
		paddingHorizontal: 16,
		marginBottom: 20,
		gap: 6,
	},
	timerBadgeExpired: { backgroundColor: "#3B0000" },
	timerIcon: { fontSize: 14 },
	timerText: { color: "#32C77F", fontWeight: "bold", fontSize: 14 },
	timerTextExpired: { color: "#FF6B6B" },
	qrContainer: {
		backgroundColor: "#FFF",
		borderRadius: 16,
		padding: 16,
		marginBottom: 24,
	},
	qrImage: { width: 220, height: 220 },
	expiredBox: {
		backgroundColor: "#3B0000",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
		alignItems: "center",
	},
	expiredText: { color: "#FF6B6B", fontSize: 15, textAlign: "center" },
	copyLabel: {
		color: "#888",
		fontSize: 13,
		alignSelf: "flex-start",
		marginBottom: 8,
	},
	copyBox: {
		backgroundColor: "#1E1E1E",
		borderRadius: 8,
		padding: 12,
		width: "100%",
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#2A2A2A",
	},
	copyCode: { color: "#AAA", fontSize: 11, lineHeight: 16 },
	copyBtn: {
		backgroundColor: "#32C77F",
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: "center",
		width: "100%",
		marginBottom: 16,
	},
	copyBtnSuccess: { backgroundColor: "#1A5C3A" },
	copyBtnText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
	infoBox: {
		backgroundColor: "#1A1A2E",
		borderRadius: 8,
		padding: 12,
		width: "100%",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#2A2A4A",
	},
	infoText: { color: "#AAA", fontSize: 13, lineHeight: 20 },
	checkBtn: {
		borderWidth: 1,
		borderColor: "#32C77F",
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: "center",
		width: "100%",
	},
	checkBtnText: { color: "#32C77F", fontSize: 15, fontWeight: "bold" },
	backBtn: {
		backgroundColor: "#D32F2F",
		paddingVertical: 14,
		borderRadius: 8,
		alignItems: "center",
		width: "100%",
		marginTop: 10,
	},
	backBtnText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
});
