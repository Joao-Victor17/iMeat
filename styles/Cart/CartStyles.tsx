import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
		padding: 20,
		paddingBottom: 110,
	},
	header: {
		color: "#FFF",
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
	},
	empty: { color: "#777", fontSize: 16, textAlign: "center", marginTop: 50 },
	cartItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: "#1E1E1E",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		alignItems: "center",
	},
	info: { flex: 1 },
	name: { color: "#FFF", fontSize: 16 },
	price: { color: "#D32F2F", fontSize: 14, fontWeight: "bold", marginTop: 5 },
	controls: { flexDirection: "row", alignItems: "center" },
	controlBtn: {
		backgroundColor: "#333",
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
	},
	disabledBtn: { opacity: 0.5 },
	controlText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
	quantity: { color: "#FFF", marginHorizontal: 15, fontSize: 16 },
	checkoutBtn: {
		backgroundColor: "#D32F2F",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	checkoutText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
