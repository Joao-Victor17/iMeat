import { api } from "./api";
import { Product } from "../types/Products";

interface BackendProduct {
	id: number;
	category_id: number;
	name: string;
	description?: string;
	price: string;
	stock: number;
	is_active: boolean;
	is_combo: boolean;
	weight_grams?: number;
	images: any[];
}

// Única fonte de verdade para o mapeamento Backend -> UI
function mapToProduct(item: BackendProduct): Product {
	return {
		id: String(item.id).padStart(3, "0"),
		name: item.name,
		price: parseFloat(item.price),
		stock: item.stock,
		is_active: item.is_active,
		image:
			item.images?.length > 0
				? item.images[0].url
				: `https://via.placeholder.com/150/1e1e1e/FFFFFF?text=${encodeURIComponent(item.name)}`,
	};
}

export const ProductService = {
	async getAll(): Promise<Product[]> {
		const { data } = await api.get<BackendProduct[]>("/products");
		return data.filter((item) => item.is_active).map(mapToProduct);
	},

	async getProducts(): Promise<Product[]> {
		const { data } = await api.get<BackendProduct[]>("/products");
		return data
			.filter((item) => item.is_active && !item.is_combo)
			.map(mapToProduct);
	},

	async getCombos(): Promise<Product[]> {
		const { data } = await api.get<BackendProduct[]>("/products");
		return data
			.filter((item) => item.is_combo && item.is_active) // assumindo que combo inativo não deve aparecer
			.map(mapToProduct);
	},
};
