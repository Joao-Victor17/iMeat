import { api } from "./api";
import { Category } from "../entities/Category";

export const CategoryService = {
  // O método devolve exatamente o que a UI precisa, já mastigado
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/categories");

    return data
      .filter((item) => item.is_active)
      .map((item) => ({
        id: String(item.id).padStart(3, "0"), // Regra do 0 mantida na camada de dados
        name: item.name,
        slug: item.slug,
        description: item.description,
        is_active: item.is_active,
        parent_id: item.parent_id,
      }));
  },
};
