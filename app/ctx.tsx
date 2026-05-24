import React from "react";
import { useStorageState } from "./useStorageState";
import { api } from "@/services/api";
import { getOrCreateGuestId } from "@/services/guest_id";

//Mover depois para um arquivo separado
type User = {
	name: string;
	email: string;
	phone: string;
};

type Guest = {
	guest_id: string;
	name: string;
	phone: string;
};

type AuthContextType = {
	signIn: (email: string, password: string) => Promise<{ error?: string }>;
	signOut: () => void;
	signInAsGuest: (name: string, phone: string) => void;
	session?: string | null; // accessToken
	user?: User | null;
	guest?: Guest | null;
	isGuest: boolean;
	isLoading: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
	signIn: async () => ({}),
	signInAsGuest: async () => null,
	signOut: () => null,
	session: null,
	user: null,
	guest: null,
	isGuest: false,
	isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
	return React.useContext(AuthContext);
}

export function SessionProvider(props: React.PropsWithChildren) {
	const [[isLoadingToken, session], setSession] = useStorageState("session");
	const [[isLoadingUser, userRaw], setUserRaw] = useStorageState("user");
	const [[isLoadingGuest, guestRaw], setGuestRaw] = useStorageState("guest");

	const guest: Guest | null = guestRaw ? JSON.parse(guestRaw) : null;
	const user: User | null = userRaw ? JSON.parse(userRaw) : null;
	const isLoading = isLoadingToken || isLoadingUser || isLoadingGuest;
	const isGuest = guest !== null;

	return (
		<AuthContext.Provider
			value={{
				signIn: async (email, password) => {
					try {
						const response = await api.post("/auth", {
							email,
							password,
						});

						if (!response) {
							return { error: "Invalid credentials" };
						}

						setSession(response.data.accessToken);
						setUserRaw(JSON.stringify(response.data.user));
						return {};
					} catch (e) {
						return {
							error: "Não foi possível se conectar ao servidor",
						};
					}
				},

				signOut: () => {
					setSession(null);
					setUserRaw(null);
					setGuestRaw(null);
				},
				signInAsGuest: (name, phone) => {
					const guest_id = getOrCreateGuestId();
					setGuestRaw(JSON.stringify({ guest_id, name, phone }));
				},
				session,
				user,
				guest,
				isGuest,
				isLoading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
