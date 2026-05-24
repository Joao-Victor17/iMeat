import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Linking,
	Alert,
	ActivityIndicator,
} from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/services/api";

type PaymentMethod = "PIX" | "CARD" | "CASH";

interface PaymentOption {
	id: PaymentMethod;
	label: string;
	description: string;
	icon: string;
	accentColor: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
	{
		id: "PIX",
		label: "PIX",
		description: "Aprovação instantânea, sem taxas",
		icon: "⚡",
		accentColor: "#32C77F",
	},
	{
		id: "CARD",
		label: "Cartão de Crédito",
		description: "Parcele em até 12x",
		icon: "💳",
		accentColor: "#009EE3",
	},
	{
		id: "CASH",
		label: "Dinheiro",
		description: "Pague na entrega ou retirada",
		icon: "💵",
		accentColor: "#FFD700",
	},
];

export default function ChoosePaymentScreen() {
	const { order_id, total } = useLocalSearchParams();
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const router = useRouter();

	const [selected, setSelected] = useState<PaymentMethod | null>(null);

	const handleConfirm = async () => {
		if (!selected) return;

		setIsProcessingPayment(true);

		try {
			if (selected === "PIX") {
				const { data } = await api.patch(`/order/${order_id}/confirm`, {
					method: "PIX",
					payerEmail: "victorcupolo@gmail.com",
				});

				router.push({
					pathname: "/order/pix" as any,
					params: {
						order_id: order_id,
						pix_copy_paste: data.pix_copy_paste,
						pix_qr_code: data.pix_qr_code,
						expires_at: data.expires_at,
					},
				});

				return;
			}

			if (selected === "CASH") {
				router.push(`/order/success?order_id=${order_id}`);
				return;
			}

			// CARD — implementar futuramente
			Alert.alert("Em breve", "Pagamento por cartão em desenvolvimento.");
		} catch (error: any) {
			Alert.alert("Erro", error.message);
		} finally {
			setIsProcessingPayment(false);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Forma de Pagamento</Text>

			{total && (
				<View style={styles.totalBadge}>
					<Text style={styles.totalBadgeLabel}>Total do pedido</Text>
					<Text style={styles.totalBadgeValue}>
						R${" "}
						{parseFloat(total as string)
							.toFixed(2)
							.replace(".", ",")}
					</Text>
				</View>
			)}

			<Text style={styles.sectionLabel}>Escolha como deseja pagar:</Text>

			<View style={styles.optionsList}>
				{PAYMENT_OPTIONS.map((option) => {
					const isSelected = selected === option.id;

					return (
						<TouchableOpacity
							key={option.id}
							style={[
								styles.optionCard,
								isSelected && {
									borderColor: option.accentColor,
									borderWidth: 2,
								},
							]}
							onPress={() => setSelected(option.id)}
							activeOpacity={0.75}
						>
							{/* Indicador de seleção */}
							<View
								style={[
									styles.radioOuter,
									isSelected && {
										borderColor: option.accentColor,
									},
								]}
							>
								{isSelected && (
									<View
										style={[
											styles.radioInner,
											{
												backgroundColor:
													option.accentColor,
											},
										]}
									/>
								)}
							</View>

							{/* Ícone */}
							<Text style={styles.optionIcon}>{option.icon}</Text>

							{/* Textos */}
							<View style={styles.optionTextGroup}>
								<Text
									style={[
										styles.optionLabel,
										isSelected && {
											color: option.accentColor,
										},
									]}
								>
									{option.label}
								</Text>
								<Text style={styles.optionDescription}>
									{option.description}
								</Text>
							</View>

							{/* Tag de destaque para PIX */}
							{option.id === "PIX" && (
								<View style={styles.recommendedBadge}>
									<Text style={styles.recommendedText}>
										Recomendado
									</Text>
								</View>
							)}
						</TouchableOpacity>
					);
				})}
			</View>

			{/* Aviso para DINHEIRO */}
			{selected === "CASH" && (
				<View style={styles.infoBox}>
					<Text style={styles.infoText}>
						💡 Tenha o valor exato. O troco não é garantido.
					</Text>
				</View>
			)}

			<View style={styles.footer}>
				<TouchableOpacity
					style={styles.backBtn}
					onPress={() => router.back()}
					activeOpacity={0.75}
				>
					<Text style={styles.backBtnText}>Voltar</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.confirmBtn,
						!selected && styles.confirmBtnDisabled,
					]}
					onPress={handleConfirm}
					disabled={isProcessingPayment}
					activeOpacity={0.8}
				>
					{isProcessingPayment ? (
						<ActivityIndicator color="#FFFFFF" size="small" />
					) : (
						<Text style={styles.confirmBtnText}>Confirmar</Text>
					)}
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
		padding: 20,
	},

	header: {
		color: "#FFF",
		fontSize: 22,
		fontWeight: "bold",
		marginVertical: 20,
		textAlign: "center",
	},

	// Badge do total (opcional, exibido se `total` for passado como param)
	totalBadge: {
		backgroundColor: "#1E1E1E",
		borderRadius: 10,
		paddingVertical: 12,
		paddingHorizontal: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	totalBadgeLabel: {
		color: "#888",
		fontSize: 14,
	},
	totalBadgeValue: {
		color: "#D32F2F",
		fontSize: 20,
		fontWeight: "bold",
	},

	sectionLabel: {
		color: "#888",
		fontSize: 13,
		marginBottom: 12,
		textTransform: "uppercase",
		letterSpacing: 0.8,
	},

	optionsList: {
		gap: 12,
		flex: 1,
	},

	optionCard: {
		backgroundColor: "#1E1E1E",
		borderRadius: 12,
		padding: 18,
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "transparent",
	},

	radioOuter: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#555",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 14,
	},
	radioInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},

	optionIcon: {
		fontSize: 26,
		marginRight: 14,
	},

	optionTextGroup: {
		flex: 1,
	},
	optionLabel: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
	},
	optionDescription: {
		color: "#888",
		fontSize: 13,
		marginTop: 2,
	},

	recommendedBadge: {
		backgroundColor: "#1A3A2A",
		borderRadius: 6,
		paddingVertical: 3,
		paddingHorizontal: 8,
	},
	recommendedText: {
		color: "#32C77F",
		fontSize: 11,
		fontWeight: "600",
	},

	// Aviso informativo (aparece para DINHEIRO)
	infoBox: {
		backgroundColor: "#1A1600",
		borderRadius: 8,
		padding: 12,
		marginTop: 16,
		borderLeftWidth: 3,
		borderLeftColor: "#FFD700",
	},
	infoText: {
		color: "#CCC",
		fontSize: 13,
		lineHeight: 18,
	},

	// Rodapé com botões
	footer: {
		flexDirection: "row",
		gap: 12,
		marginTop: 20,
		marginBottom: 10,
	},

	backBtn: {
		flex: 1,
		backgroundColor: "#1E1E1E",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	backBtnText: {
		color: "#888",
		fontSize: 15,
		fontWeight: "600",
	},

	confirmBtn: {
		flex: 2,
		backgroundColor: "#D32F2F",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	confirmBtnDisabled: {
		backgroundColor: "#3A1A1A",
	},
	confirmBtnText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
	},
});
