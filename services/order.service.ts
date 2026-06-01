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
	const guest_id = props.guest?.guest_id;
	const guest_firstName = props.guest?.payerFirstName_guest;
	const guest_lastName = props.guest?.payerLastName_guest;
	const guest_phone = props.guest?.phone;
	const guest_email = props.guest?.email;
	const guest_identificationType = props.guest?.identificationType;
	const guest_identificationNumber = props.guest?.identificationNumber;

	try {
		const orderPayload = props.isGuest
			? {
					items: props.cart.map((item) => ({
						product_id: Number(item.id),
						quantity: item.quantity,
					})),
					guest_id: guest_id,
					guest_first_name: guest_firstName,
					guest_last_name: guest_lastName,
					guest_phone,
					guest_email,
					guest_identification_type: guest_identificationType,
					guest_identification_number: guest_identificationNumber,
				}
			: {
					items: props.cart.map((item) => ({
						product_id: Number(item.id),
						quantity: item.quantity,
					})),
					user_id: null,
				};

		// const { data: order } = await api.post("/order", orderPayload, {
		// 	headers: props.session
		// 		? { Authorization: `Bearer ${props.session}` }
		// 		: {},
		// });

		// 2. Redireciona para a tela de Resumo passando o ID da ordem criada
		router.push("/order/address");
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
