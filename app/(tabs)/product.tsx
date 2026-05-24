import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Product } from "@/types/Products";
import { loadActiveProducts } from "@/hooks/loadProducts";
import { ProductStyles } from "@/styles/Products/ProductsStyles";
import ProductList from "@/components/Products/ProductList";

export default function ProductScreen() {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadActiveProducts({ setProducts, setIsLoading });
	}, []);

	return (
		<View style={ProductStyles.container}>
			<Text style={ProductStyles.header}>Cortes Disponíveis</Text>

			{isLoading ? (
				<View style={ProductStyles.loadingContainer}>
					<ActivityIndicator size="large" color="#D32F2F" />
				</View>
			) : (
				<ProductList products={products} isLoading={isLoading} />
			)}
		</View>
	);
}
