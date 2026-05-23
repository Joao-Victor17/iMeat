import axios from "axios";

// Crie a instância do Axios com a URL base do seu NestJS
export const api = axios.create({
	// Substitua pelo IP da sua máquina. O prefixo /api já está aqui!
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	timeout: 10000, // Aborta a requisição se demorar mais de 10s
});

// Opcional: Interceptador para logs (muito útil no terminal do Expo)
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Formata o erro do NestJS para ficar fácil de ler no frontend
		const message = error.response?.data?.message || error.message;
		console.error(`[API Error] ${error.config?.url}:`, message);
		return Promise.reject(new Error(message));
	},
);
