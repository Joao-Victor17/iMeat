import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
	},
	cartButton: {
		padding: 5,
		position: "relative",
	},
	cartIcon: {
		fontSize: 24,
	},
	cartBadge: {
		position: "absolute",
		top: -2,
		right: -5,
		backgroundColor: "#D32F2F",
		borderRadius: 10,
		minWidth: 18,
		height: 18,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 4,
	},
	cartBadgeText: {
		color: "#FFF",
		fontSize: 10,
		fontWeight: "bold",
	},
	cartDropdown: {
		position: "absolute",
		top: 60,
		right: 20,
		backgroundColor: "#1E1E1E",
		padding: 15,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#333",
		zIndex: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.5,
		shadowRadius: 5,
	},
	cartDropdownText: {
		color: "#AAA",
		fontSize: 14,
	},
	content: {
		flex: 1,
	},
	section: {
		marginTop: 20,
		paddingLeft: 20,
	},
	sectionTitle: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12,
	},
});
