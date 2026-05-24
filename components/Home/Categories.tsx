import { categoriesStyles } from "@/styles/Home/CategoriesStyles";
import { Category } from "@/types/Category";
import { FlatList, Text, TouchableOpacity } from "react-native";

export default function Categories(props: { categories: Category[] }) {
	return (
		<FlatList
			data={props.categories}
			horizontal
			showsHorizontalScrollIndicator={false}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<TouchableOpacity style={categoriesStyles.categoryBadge}>
					<Text style={categoriesStyles.categoryText}>
						{item.name}
					</Text>
				</TouchableOpacity>
			)}
		/>
	);
}
