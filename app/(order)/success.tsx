import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PedidoSucessoScreen() {
  const router = useRouter();

  // Captura os parâmetros da URL automaticamente (ex: ?order_id=42)
  const { order_id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      <View style={styles.content}>
        {/* Ícone de Sucesso */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Pagamento Aprovado!</Text>

        <Text style={styles.message}>
          Sua compra foi confirmada com sucesso. Nosso mestre churrasqueiro já
          está preparando o seu pedido.
        </Text>

        <View style={styles.orderCard}>
          <Text style={styles.orderLabel}>Número do Pedido</Text>
          {/* Exibe o order_id vindo do Mercado Pago, com fallback caso não venha */}
          <Text style={styles.orderNumber}>#{order_id || "---"}</Text>
        </View>
      </View>

      {/* Botão de Retorno */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Volta para a raiz (Home) descartando o histórico da tela de sucesso
            router.replace("/");
          }}
        >
          <Text style={styles.buttonText}>Voltar para o Início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 30,
    // Adiciona um brilho sutil ao redor do ícone
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    color: "#AAAAAA",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
  },
  orderCard: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  orderLabel: {
    color: "#777777",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  orderNumber: {
    color: "#D32F2F", // O Vermelho Prime da sua paleta
    fontSize: 24,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    paddingBottom: 40, // Espaço extra para a Safe Area inferior
  },
  button: {
    backgroundColor: "#D32F2F",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
