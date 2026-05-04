import React from "react";
import { Tabs } from "expo-router";
import { CartProvider, useCart } from "../components/CartContext";
import { StatusBar, Platform } from "react-native";

// Importando os ícones profissionais nativos do Expo
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

function TabNavigator() {
  const { cart } = useCart();

  // Calculamos a integral da quantidade (total de itens)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#121212",
          borderTopColor: "#2A2A2A",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 85 : 130,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
          marginTop: 4,
        },
        tabBarActiveTintColor: "#D32F2F", // Vermelho Prime
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrinho",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size || 24} color={color} />
          ),
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#D32F2F",
            color: "#FFFFFF",
            fontSize: 10,
          },
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Produtos",
          // Usando MaterialCommunityIcons para o ícone de carne (Steak)
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="food-steak"
              size={size || 26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          // Usando Ionicons para o Perfil
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order/success"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="order/resume"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <TabNavigator />
    </CartProvider>
  );
}
