import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { carrosselStyles } from "@/styles/Home/CarrosselStyles";

// --- DADOS DE EXEMPLO ---
const COMBOS = [
	{
		id: "001",
		title: "Combo Churrasco Família",
		price: "R$ 149,90",
		image: "https://via.placeholder.com/300x150/8B0000/FFFFFF?text=Combo+Familia",
	},
	{
		id: "002",
		title: "Kit Picanha Premium",
		price: "R$ 199,90",
		image: "https://via.placeholder.com/300x150/8B0000/FFFFFF?text=Kit+Premium",
	},
];

export default function CarrosselCombos() {
	return (
		<FlatList
			data={COMBOS}
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
							{item.title}
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
