import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// Define o token como header padrão em todas as requisições futuras
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Erro desconhecido";

    // Garante que message seja sempre string (NestJS às vezes retorna array)
    const finalMessage = Array.isArray(message) ? message.join(", ") : message;

    return Promise.reject(new Error(finalMessage));
  },
);
