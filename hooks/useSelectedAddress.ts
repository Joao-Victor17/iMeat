// hooks/useSelectAddress.ts
import { useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { Alert } from "react-native";

export function useSelectAddress() {
	const router = useRouter();
	const { cart } = useCart();

	const handleSelectAddress = (address: {
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
			"Confirmar endereço",
			`Entregar em:\n${address.street}, ${address.numberAddress ?? address.number} — ${address.neighborhood}, ${address.city}`,
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Confirmar",
					onPress: () =>
						router.push({
							pathname: "/order/resume",
							params: { address: JSON.stringify(address) },
						}),
				},
			],
		);
	};

	return { handleSelectAddress };
}
