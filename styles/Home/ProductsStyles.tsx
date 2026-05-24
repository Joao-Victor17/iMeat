import { StyleSheet } from "react-native";

export const ProductsStyles = StyleSheet.create({
	productsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		paddingRight: 10,
	},
	productCard: {
		width: "48%",
		backgroundColor: "#1E1E1E",
		borderRadius: 12,
		padding: 10,
		marginBottom: 15,
	},
	productImage: {
		width: "100%",
		height: 120,
		borderRadius: 8,
		marginBottom: 10,
	},
	productName: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 5,
		height: 40,
	},
	productPrice: {
		color: "#D32F2F",
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 10,
	},
	buyButton: {
		backgroundColor: "#D32F2F",
		paddingVertical: 8,
		borderRadius: 6,
		alignItems: "center",
	},
	buyButtonText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "bold",
	},
	buttonDisabled: {
		backgroundColor: "#D32F2F",
		opacity: 0.5,
	},
});
