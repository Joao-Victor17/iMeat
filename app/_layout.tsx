import React from "react";
import { SessionProvider } from "./ctx";
import { CartProvider } from "../components/CartContext";
import { StatusBar } from "react-native";
import { Stack } from "expo-router";

export const unstable_settings = {
	initialRouteName: "login",
};

export default function RootLayout() {
	return (
		<SessionProvider>
			<CartProvider>
				<StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="login" />
					<Stack.Screen name="(tabs)" />
					<Stack.Screen name="order/success" />
					<Stack.Screen name="order/resume" />
					<Stack.Screen name="order/choose_payment" />
					<Stack.Screen name="order/pix" />
				</Stack>
			</CartProvider>
		</SessionProvider>
	);
}
