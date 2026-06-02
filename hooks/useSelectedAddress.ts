// hooks/useSelectAddress.ts
import { useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { Alert } from "react-native";
import { useState } from "react";
import { api } from "@/services/api";
import { useSession } from "@/contexts/ctx";

export function useSelectAddress(source: "newAddress" | "getAddress") {
	const router = useRouter();
	const { cart } = useCart();
	const { session } = useSession();

	const [isLoading, setIsLoading] = useState(false);

	const handleSelectAddress = (address: {
		id?: number;
		formatted: string;
		street: string;
		numberAddress?: string;
		number?: string;
		complement?: string;
		neighborhood: string;
		city: string;
		state: string;
		cep: string;
		latitude: number;
		longitude: number;
	}) => {
		if (!cart || cart.length === 0) {
			Alert.alert(
				"Carrinho vazio",
				"Adicione itens ao carrinho antes de escolher um endereço.",
				[{ text: "Ok" }],
			);
			return;
		}

		Alert.alert(
			"Há itens no carrinho.",
			`Entregar em:\n${address.street}, ${address.numberAddress ?? address.number} — ${address.neighborhood}, ${address.city}`,
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Confirmar",
					onPress: async () => {
						if (source === "newAddress") {
							setIsLoading(true);
							try {
								console.log(JSON.stringify(address));
								const response = await api.post(
									"address",
									{
										formatted: address.formatted,
										street: address.street,
										numberAddress: address.numberAddress,
										number: address.number,
										complement: address.complement,
										neighborhood: address.neighborhood,
										city: address.city,
										state: address.state,
										cep: address.cep.replace(/[^0-9]/g, ""),
										latitude: address.latitude,
										longitude: address.longitude,
									},
									{ headers: { Authorization: session } },
								);

								router.push({
									pathname: "/order/resume",
									params: { address_id: response.data.id },
								});
							} catch (error) {
								setIsLoading(false);
								console.error(error);
							} finally {
								setIsLoading(false);
							}
						}

						if (source === "getAddress") {
							router.push({
								pathname: "/order/resume",
								params: { address_id: address.id },
							});
						}
					},
				},
			],
		);
	};

	return { handleSelectAddress };
}
