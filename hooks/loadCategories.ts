import { Category } from "@/entities/Category";
import { CategoryService } from "@/services/category.service";

export const loadCategories = async (props: {
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    // 3. O Service abstrai o Axios, o parse do JSON e a formatação (ex: 0 à esquerda)
    const data = await CategoryService.getAll();

    // Como a Home geralmente mostra destaques, você pode limitar a quantidade,
    // mas por enquanto, vamos mostrar todos (ou os 4 primeiros com .slice(0, 4))
    props.setCategories(data);
  } catch (error) {
    console.error("Falha ao carregar categorias na Home:", error);
  } finally {
    props.setIsLoading(false);
  }
};
