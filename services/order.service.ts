import { router } from "expo-router";
import { api } from "./api";
import { Alert } from "react-native";
import { User } from "@/types/User";
import { Guest } from "@/types/Guest_User";
import { CartItem } from "@/contexts/CartContext";

export const handleCheckout = async (props: {
	setIsCheckingOut: React.Dispatch<React.SetStateAction<boolean>>;
	user?: User | null;
	session?: string | null;
	guest?: Guest | null;
	isGuest: boolean;
	cart: CartItem[];
}) => {
	props.setIsCheckingOut(true);
	// Captura o valor no momento do clique
	const guestId = props.guest?.guest_id;
	const guestName = props.guest?.name;
	const guestPhone = props.guest?.phone;
	const userId = props.user?.user_id;

	try {
		const orderPayload = props.isGuest
			? {
					items: props.cart.map((item) => ({
						product_id: Number(item.id),
						quantity: item.quantity,
					})),
					guest_id: guestId,
					guest_name: guestName,
					guest_phone: guestPhone,
				}
			: {
					items: props.cart.map((item) => ({
						product_id: Number(item.id),
						quantity: item.quantity,
					})),
					user_id: userId,
				};

		// 1. Gera APENAS a Ordem (Etapa 1)
		// 1. Cria a Ordem (O Axios já faz o stringify e já retorna o JSON em 'data')
		console.log("guest:", props.guest);
		console.log("orderPayload:", orderPayload);

		const { data: order } = await api.post("/order", orderPayload, {
			headers: props.session
				? { Authorization: `Bearer ${props.session}` }
				: {},
		});

		// 2. Redireciona para a tela de Resumo passando o ID da ordem criada
		router.push(`/order/resume?order_id=${order.id}`);
	} catch (error: any) {
		console.error(error);
		Alert.alert(
			"Aviso",
			error.message || "Não foi possível gerar o pedido.",
		);
	} finally {
		props.setIsCheckingOut(false);
	}
};
