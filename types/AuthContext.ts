import { Guest } from "./Guest_User";
import { User } from "./User";

export type AuthContextType = {
	signIn: (email: string, password: string) => Promise<{ error?: string }>;
	signOut: () => void;
	signInAsGuest: (name: string, phone: string) => void;
	session?: string | null; // accessToken
	user?: User | null;
	guest?: Guest | null;
	isGuest: boolean;
	isLoading: boolean;
};
