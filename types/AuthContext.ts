import { User } from "./User";

export type AuthContextType = {
	signIn: (email: string, password: string) => Promise<{ error?: string }>;
	signOut: () => void;
	registerUser: (
		firstName: string,
		lastName: string,
		email: string,
		phone: string,
		docType: "CPF" | "CNPJ",
		document: string,
		password: string,
	) => Promise<{ error?: string }>;
	session?: string | null; // accessToken
	user?: User | null;
	isLoading: boolean;
};
