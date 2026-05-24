import { Text, View } from "react-native";
import { footerStyles } from "@/styles/Cart/FooterStyles";

export function FooterCart(props: { totalPrice: number }) {
	return (
		<View style={footerStyles.footer}>
			<Text style={footerStyles.totalText}>Total:</Text>
			<Text style={footerStyles.totalPrice}>
				R$ {props.totalPrice.toFixed(2).replace(".", ",")}
			</Text>
		</View>
	);
}
