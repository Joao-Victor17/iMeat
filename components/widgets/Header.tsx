import { Text, View } from "react-native";
import { headerStyles } from "@/styles/HeaderStyles";

export default function Header() {
	return (
		<View style={headerStyles.header}>
			<Text style={headerStyles.logoText}>
				I MEAT <Text style={headerStyles.logoAccent}>PRIME</Text>
			</Text>
		</View>
	);
}
