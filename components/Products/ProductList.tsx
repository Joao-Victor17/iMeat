import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { Product } from "@/types/Products";
import { ProductStyles } from "@/styles/Products/ProductsStyles";
import { useCart } from "@/contexts/CartContext";

export default function ProductList(props: {
	products: Product[];
	isLoading: boolean;
}) {
	const { addToCart } = useCart();
	return (
		<FlatList
			data={props.products}
			keyExtractor={(item) => item.id}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: 30 }}
			renderItem={({ item }) => (
				<View style={ProductStyles.card}>
					<Image
						source={{ uri: item.image }}
						style={ProductStyles.image}
					/>
					<View style={ProductStyles.info}>
						<Text style={ProductStyles.name} numberOfLines={2}>
							{item.name}
						</Text>
						<Text style={ProductStyles.price}>
							R$ {item.price.toFixed(2).replace(".", ",")}
						</Text>
						<Text
							style={[
								ProductStyles.stock,
								item.stock === 0 && ProductStyles.outOfStock,
							]}
						>
							{item.stock > 0
								? `Estoque: ${item.stock} un`
								: "Esgotado"}
						</Text>
					</View>
					<TouchableOpacity
						style={[
							ProductStyles.button,
							item.stock === 0 && ProductStyles.buttonDisabled,
						]}
						onPress={() => addToCart(item)}
						disabled={item.stock === 0}
					>
						<Text style={ProductStyles.buttonText}>+</Text>
					</TouchableOpacity>
				</View>
			)}
		/>
	);
}
