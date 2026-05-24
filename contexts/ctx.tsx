import React from "react";
import { useStorageState } from "../app/useStorageState";
import { api } from "@/services/api";
import { getOrCreateGuestId } from "@/services/guest_id";
import { AuthContextType } from "@/types/AuthContext";
import { Guest } from "@/types/Guest_User";
import { User } from "@/types/User";

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
							error: `Não foi possível se conectar ao servidor: ${e}`,
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
