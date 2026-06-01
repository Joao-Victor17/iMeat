import { StyleSheet } from "react-native";

export const addressStyles = StyleSheet.create({
	scrollContent: {
		paddingBottom: 30,
	},
	flex: {
		flex: 1,
	},
	container: {
		flex: 1,
		backgroundColor: "#0A0A0A",
	},

	// ── Header ──────────────────────────────────────────────
	header: {
		paddingHorizontal: 20,
		paddingBottom: 8,
	},
	headerTitle: {
		color: "#FFFFFF",
		fontSize: 20,
		fontWeight: "bold",
	},
	headerSubtitle: {
		color: "#777",
		fontSize: 13,
		marginTop: 2,
	},

	// ── Tabs ────────────────────────────────────────────────
	tabs: {
		flexDirection: "row",
		marginHorizontal: 20,
		marginBottom: 10,
		backgroundColor: "#1E1E1E",
		borderRadius: 10,
		padding: 4,
		borderWidth: 1,
		borderColor: "#333",
	},
	tab: {
		flex: 1,
		paddingVertical: 8,
		borderRadius: 8,
		alignItems: "center",
	},
	tabActive: {
		backgroundColor: "#D32F2F",
	},
	tabText: {
		color: "#777",
		fontSize: 14,
		fontWeight: "500",
	},
	tabTextActive: {
		color: "#FFFFFF",
		fontWeight: "bold",
	},

	// ── Busca por logradouro ─────────────────────────────────
	searchWrapper: {
		paddingHorizontal: 20,
		marginBottom: 8,
		zIndex: 10,
		elevation: 10,
	},
	cityRow: {
		flexDirection: "row",
		gap: 8,
		marginBottom: 8,
	},
	cityInput: {
		backgroundColor: "#1E1E1E",
		color: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#333",
		borderRadius: 10,
		fontSize: 14,
		paddingHorizontal: 12,
		height: 44,
	},
	searchInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#1E1E1E",
		borderWidth: 1,
		borderColor: "#333",
		borderRadius: 10,
		paddingHorizontal: 14,
		height: 48,
	},
	searchInput: {
		flex: 1,
		color: "#FFFFFF",
		fontSize: 14,
	},
	searchSpinner: {
		marginLeft: 8,
	},
	suggestionList: {
		backgroundColor: "#1E1E1E",
		borderWidth: 1,
		borderColor: "#333",
		borderRadius: 10,
		marginTop: 4,
		elevation: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.5,
		shadowRadius: 6,
		zIndex: 20,
	},
	suggestionRow: {
		paddingVertical: 12,
		paddingHorizontal: 14,
	},
	suggestionRowBorder: {
		borderBottomWidth: 1,
		borderBottomColor: "#333",
	},
	suggestionStreet: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "500",
	},
	suggestionDetail: {
		color: "#777",
		fontSize: 12,
		marginTop: 2,
	},

	// ── Busca por CEP ───────────────────────────────────────
	cepWrapper: {
		paddingHorizontal: 20,
		marginBottom: 8,
	},
	cepRow: {
		flexDirection: "row",
		gap: 10,
	},
	cepInput: {
		flex: 1,
		backgroundColor: "#1E1E1E",
		color: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#333",
		borderRadius: 10,
		fontSize: 16,
		paddingHorizontal: 14,
		height: 48,
		letterSpacing: 1,
	},
	cepButton: {
		backgroundColor: "#D32F2F",
		borderRadius: 10,
		paddingHorizontal: 20,
		height: 48,
		justifyContent: "center",
		alignItems: "center",
		minWidth: 90,
	},
	cepButtonText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		fontSize: 14,
	},

	// ── Mapa ────────────────────────────────────────────────
	mapContainer: {
		height: 280, // ← era flex: 1
		marginHorizontal: 20,
		borderRadius: 14,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#333",
		zIndex: 1,
	},

	map: {
		flex: 1,
	},
	mapHint: {
		position: "absolute",
		bottom: 10,
		alignSelf: "center",
		backgroundColor: "rgba(0,0,0,0.7)",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	mapHintText: {
		color: "#AAA",
		fontSize: 12,
	},

	// ── Card endereço + número/complemento ──────────────────
	addressCard: {
		marginHorizontal: 20,
		marginTop: 10,
		backgroundColor: "#1E1E1E",
		borderRadius: 10,
		padding: 12,
		borderWidth: 1,
		borderColor: "#333",
		borderLeftWidth: 3,
		borderLeftColor: "#D32F2F",
	},
	addressCardLabel: {
		color: "#D32F2F",
		fontSize: 11,
		fontWeight: "bold",
		textTransform: "uppercase",
		letterSpacing: 0.8,
		marginBottom: 4,
	},
	addressCardText: {
		color: "#CCC",
		fontSize: 13,
		lineHeight: 18,
		marginBottom: 10,
	},
	extraFieldsRow: {
		flexDirection: "row",
		gap: 8,
		marginTop: 4,
	},
	extraInput: {
		backgroundColor: "#0A0A0A",
		color: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#444",
		borderRadius: 8,
		fontSize: 14,
		paddingHorizontal: 12,
		height: 42,
	},

	// ── Footer / botões ─────────────────────────────────────
	footer: {
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 10,
		gap: 8,
	},
	saveButton: {
		backgroundColor: "#1E1E1E",
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#D32F2F",
	},
	saveButtonText: {
		color: "#D32F2F",
		fontWeight: "bold",
		fontSize: 15,
	},
	confirmButton: {
		backgroundColor: "#D32F2F",
		borderRadius: 12,
		paddingVertical: 16,
		alignItems: "center",
		shadowColor: "#D32F2F",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.35,
		shadowRadius: 8,
		elevation: 6,
	},
	confirmButtonDisabled: {
		backgroundColor: "#4a1a1a",
		shadowOpacity: 0,
		elevation: 0,
	},
	confirmButtonText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		fontSize: 16,
	},
});
