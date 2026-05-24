import {
	View,
	ActivityIndicator,
	Image,
	Text,
	TouchableOpacity,
} from "react-native";
import { ProductsStyles } from "@/styles/Home/ProductsStyles";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/Products";

export default function ProductsGrid(props: {
	products: Product[];
	isLoading: boolean;
}) {
	const { addToCart } = useCart();

	return (
		<View style={ProductsStyles.productsGrid}>
			{props.isLoading ? (
				<ActivityIndicator
					size="large"
					color="#D32F2F"
					style={{ marginTop: 20 }}
				/>
			) : (
				<View style={ProductsStyles.productsGrid}>
					{/* O map agora itera sobre o estado 'products' e não mais na constante */}
					{props.products.map((product) => (
						<TouchableOpacity
							key={product.id}
							style={ProductsStyles.productCard}
						>
							<Image
								source={{ uri: product.image }}
								style={ProductsStyles.productImage}
							/>
							<Text
								style={ProductsStyles.productName}
								numberOfLines={2}
							>
								{product.name}
							</Text>
							<Text style={ProductsStyles.productPrice}>
								R$ {product.price.toFixed(2).replace(".", ",")}
							</Text>

							<TouchableOpacity
								style={[
									ProductsStyles.buyButton,
									product.stock === 0 &&
										ProductsStyles.buttonDisabled,
								]}
								onPress={() => addToCart(product)}
								disabled={product.stock === 0}
							>
								<Text style={ProductsStyles.buyButtonText}>
									{product.stock === 0
										? "Esgotado"
										: "Adicionar"}
								</Text>
							</TouchableOpacity>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	);
}
