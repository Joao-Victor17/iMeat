// app/my_orders.tsx
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/services/api";
import { getOrCreateGuestId } from "@/services/guest_id";

interface Order {
	id: number;
	status: string;
	total: string;
	created_at: string;
}

const STATUS_COLOR: Record<string, string> = {
	pending: "#FFD700",
	confirmed: "#009EE3",
	delivered: "#32C77F",
	cancelled: "#D32F2F",
};

export default function MyOrdersScreen() {
	const router = useRouter();
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const guest_id = getOrCreateGuestId();
			console.log(guest_id);
			const { data } = await api.get(`/order/guest/${guest_id}`);
			setOrders(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<View style={[styles.container, styles.centered]}>
				<ActivityIndicator size="large" color="#D32F2F" />
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Meus Pedidos</Text>

			{orders.length === 0 ? (
				<View style={styles.centered}>
					<Text style={styles.empty}>
						Você ainda não fez nenhum pedido.
					</Text>
				</View>
			) : (
				<FlatList
					data={orders}
					keyExtractor={(item) => item.id.toString()}
					contentContainerStyle={{ gap: 12 }}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.card}
							onPress={() =>
								router.push(`/order/resume?order_id=${item.id}`)
							}
							activeOpacity={0.75}
						>
							<View style={styles.cardRow}>
								<Text style={styles.orderId}>
									Pedido #{item.id}
								</Text>
								<Text
									style={[
										styles.status,
										{
											color:
												STATUS_COLOR[item.status] ??
												"#888",
										},
									]}
								>
									{item.status}
								</Text>
							</View>

							<View style={styles.divider} />

							<View style={styles.cardRow}>
								<Text style={styles.date}>
									{new Date(
										item.created_at,
									).toLocaleDateString("pt-BR")}
								</Text>
								<Text style={styles.total}>
									R${" "}
									{parseFloat(item.total)
										.toFixed(2)
										.replace(".", ",")}
								</Text>
							</View>
						</TouchableOpacity>
					)}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0A0A0A", padding: 20 },
	centered: { flex: 1, justifyContent: "center", alignItems: "center" },
	header: {
		color: "#FFF",
		fontSize: 22,
		fontWeight: "bold",
		marginVertical: 20,
		textAlign: "center",
	},
	empty: { color: "#777", fontSize: 16 },
	card: {
		backgroundColor: "#1E1E1E",
		borderRadius: 12,
		padding: 18,
	},
	cardRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	orderId: { color: "#FFF", fontSize: 16, fontWeight: "600" },
	status: { fontSize: 13, fontWeight: "bold", textTransform: "uppercase" },
	divider: { height: 1, backgroundColor: "#333", marginVertical: 12 },
	date: { color: "#888", fontSize: 13 },
	total: { color: "#D32F2F", fontSize: 16, fontWeight: "bold" },
});
