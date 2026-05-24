import { StyleSheet } from "react-native";

export const footerStyles = StyleSheet.create({
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
});
