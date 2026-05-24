import { StyleSheet } from "react-native";

export const headerStyles = StyleSheet.create({
	logoText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	logoAccent: {
		color: "#D32F2F",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 5,
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: "#121212",
		borderBottomWidth: 1,
		borderBottomColor: "#2A2A2A",
		zIndex: 10,
	},
});
