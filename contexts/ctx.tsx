import React from "react";
import { useStorageState } from "../hooks/useStorageState";
import { api } from "@/services/api";
import { AuthContextType } from "@/types/AuthContext";
import { User } from "@/types/User";

const AuthContext = React.createContext<AuthContextType>({
	signIn: async () => ({}),
	registerUser: async () => ({}),
	signOut: () => null,
	session: null,
	user: null,
	isLoading: true,
});

// This hook can be used to access the user info.
export function useSession() {
	return React.useContext(AuthContext);
}

export function SessionProvider(props: React.PropsWithChildren) {
	const [[isLoadingToken, session], setSession] = useStorageState("session");
	const [[isLoadingUser, userRaw], setUserRaw] = useStorageState("user");

	const user: User | null = userRaw ? JSON.parse(userRaw) : null;
	const isLoading = isLoadingToken || isLoadingUser;

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
				},
				registerUser: async (
					firstName,
					lastName,
					email,
					phone,
					docType,
					document,
					password,
				) => {
					try {
						await api.post("/users", {
							firstName,
							lastName,
							email,
							phone,
							docType,
							document,
							password,
						});
						return {};
					} catch (e) {
						return { error: `Erro ao cadastrar: ${e}` };
					}
				},
				session,
				user,
				isLoading,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
