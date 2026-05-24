import { CartItem } from "@/contexts/CartContext";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from "@/styles/Cart/CartStyles";

export function ProductsCart(props: {
	cart: CartItem[];
	removeFromCart: (id: string) => void;
	addToCart: (item: CartItem) => void;
}) {
	return (
		<FlatList
			data={props.cart}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<View style={styles.cartItem}>
					<View style={styles.info}>
						<Text style={styles.name}>{item.name}</Text>
						<Text style={styles.price}>
							R${" "}
							{(item.price * item.quantity)
								.toFixed(2)
								.replace(".", ",")}
						</Text>
					</View>

					<View style={styles.controls}>
						<TouchableOpacity
							style={styles.controlBtn}
							onPress={() => props.removeFromCart(item.id)}
						>
							<Text style={styles.controlText}>-</Text>
						</TouchableOpacity>
						<Text style={styles.quantity}>{item.quantity}</Text>
						<TouchableOpacity
							style={[
								styles.controlBtn,
								item.quantity >= item.stock &&
									styles.disabledBtn,
							]}
							onPress={() => props.addToCart(item)}
							disabled={item.quantity >= item.stock}
						>
							<Text style={styles.controlText}>+</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		/>
	);
}
