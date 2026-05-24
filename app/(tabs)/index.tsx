import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { loadProducts } from "@/hooks/loadProducts";
import { Category } from "@/types/Category";
import { Product } from "@/types/Products";
import { loadCategories } from "@/hooks/loadCategories";
import { homeStyles } from "@/styles/Home/HomeStyles";
import CarrosselCombos from "@/components/Home/CarrosselCombos";
import Categories from "@/components/Home/Categories";
import ProductsGrid from "@/components/Home/ProductsGrid";

export default function Index() {
	// Extraímos os métodos e dados do carrinho
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadProducts({ setProducts, setIsLoading });
		loadCategories({ setCategories, setIsLoading });
	}, []);

	return (
		<SafeAreaView style={homeStyles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

			{/* CONTEÚDO ROLÁVEL */}
			<ScrollView
				style={homeStyles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* BANNER CARROSSEL (Combos) */}
				<View style={homeStyles.section}>
					<CarrosselCombos />
				</View>

				{/* CATEGORIAS */}
				<View style={homeStyles.section}>
					<Text style={homeStyles.sectionTitle}>Categorias</Text>
					<Categories categories={categories} />
				</View>

				{/* PRODUTOS (Todos) */}
				<View style={homeStyles.section}>
					<Text style={homeStyles.sectionTitle}>Nossos Produtos</Text>
					<ProductsGrid products={products} isLoading={isLoading} />
				</View>

				{/* Adicione o contentContainerStyle para dar um respiro no final da lista */}
				<ScrollView
					style={homeStyles.content}
					contentContainerStyle={{ paddingBottom: 30 }}
					showsVerticalScrollIndicator={false}
				></ScrollView>
			</ScrollView>
		</SafeAreaView>
	);
}
