import {
	ActivityIndicator,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { carrosselStyles } from "@/styles/Home/CarrosselStyles";
import { ProductService } from "@/services/product.service";
import { useEffect, useState } from "react";
import { Product } from "@/types/Products";

export default function CarrosselCombos() {
	const [combos, setCombos] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	async function fetchCombos() {
		const data = await ProductService.getCombos();
		setCombos(data);
	}

	useEffect(() => {
		setLoading(true);
		try {
			fetchCombos();
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
		fetchCombos();
	}, []);

	if (loading) return <ActivityIndicator />;

	return (
		<FlatList
			data={combos}
			horizontal
			showsHorizontalScrollIndicator={false}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<TouchableOpacity style={carrosselStyles.bannerCard}>
					<Image
						source={{ uri: item.image }}
						style={carrosselStyles.bannerImage}
					/>
					<View style={carrosselStyles.bannerTextContainer}>
						<Text style={carrosselStyles.bannerTitle}>
							{item.name}
						</Text>
						<Text style={carrosselStyles.bannerPrice}>
							{item.price}
						</Text>
					</View>
				</TouchableOpacity>
			)}
		/>
	);
}
