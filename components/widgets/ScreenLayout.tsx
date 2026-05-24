import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";

export default function ScreenLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SafeAreaView style={styles.container}>
			<Header />
			{children}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#0A0A0A" },
});
