import { StyleSheet } from "react-native";

export const ProductStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
		paddingHorizontal: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		color: "#FFF",
		fontSize: 22,
		fontWeight: "bold",
		marginTop: 20,
		marginBottom: 20,
	},
	card: {
		flexDirection: "row",
		backgroundColor: "#1E1E1E",
		padding: 10,
		borderRadius: 10,
		marginBottom: 15,
		alignItems: "center",
	},
	image: {
		width: 60,
		height: 60,
		borderRadius: 8,
		marginRight: 15,
	},
	info: {
		flex: 1,
	},
	name: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "600",
		textTransform: "capitalize",
	},
	price: {
		color: "#D32F2F",
		fontSize: 14,
		fontWeight: "bold",
		marginTop: 4,
	},
	stock: {
		color: "#888",
		fontSize: 12,
		marginTop: 4,
	},
	outOfStock: {
		color: "#D32F2F",
	},
	button: {
		backgroundColor: "#D32F2F",
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
	},
	buttonDisabled: {
		backgroundColor: "#333",
	},
	buttonText: {
		color: "#FFF",
		fontWeight: "bold",
		fontSize: 20,
	},
});
