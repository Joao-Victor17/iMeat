import { api } from "./api";
import { Product } from "../types/Products";

// Tipagem do que vem do NestJS
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

export const ProductService = {
	// O método devolve exatamente o que a UI precisa, já mastigado
	async getAll(): Promise<Product[]> {
		const { data } = await api.get<BackendProduct[]>("/products");

		return data
			.filter((item) => item.is_active)
			.map((item) => ({
				id: String(item.id).padStart(3, "0"), // Regra do 0 mantida na camada de dados
				name: item.name,
				price: parseFloat(item.price),
				stock: item.stock,
				is_active: item.is_active,
				image:
					item.images?.length > 0
						? item.images[0].url
						: `https://via.placeholder.com/150/1e1e1e/FFFFFF?text=${encodeURIComponent(item.name)}`,
			}));
	},
};
