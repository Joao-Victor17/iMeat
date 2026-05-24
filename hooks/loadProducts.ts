import { Product } from "@/types/Products";
import { ProductService } from "@/services/product.service";

export const loadProducts = async (props: {
	setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	try {
		// 3. O Service abstrai o Axios, o parse do JSON e a formatação (ex: 0 à esquerda)
		const data = await ProductService.getAll();

		// Como a Home geralmente mostra destaques, você pode limitar a quantidade,
		// mas por enquanto, vamos mostrar todos (ou os 4 primeiros com .slice(0, 4))
		props.setProducts(data);
	} catch (error) {
		console.error("Falha ao carregar produtos na Home:", error);
	} finally {
		props.setIsLoading(false);
	}
};

export const loadActiveProducts = async (props: {
	setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	try {
		const data = await ProductService.getAll();

		// Filtra apenas os produtos ativos para exibir na vitrine
		const activeProducts = data.filter((_, index) => data[index].is_active);

		props.setProducts(data);
	} catch (error) {
		console.error("Falha ao carregar produtos ativos:", error);
	} finally {
		props.setIsLoading(false);
	}
};
