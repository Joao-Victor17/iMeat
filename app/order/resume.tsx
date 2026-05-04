import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

// Tipagem baseada no seu endpoint findById
interface OrderDetails {
  id: number;
  status: string;
  total: string;
  order_items: any[];
}

export default function ResumoPedidoScreen() {
  const { order_id } = useLocalSearchParams();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Busca os detalhes da ordem assim que a tela abre
  useEffect(() => {
    if (order_id) fetchOrderDetails();
  }, [order_id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.189:3000/api/order/${order_id}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar pedido.");
      }
      setOrder(data);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const confirmPayload = {
        method: "PIX",
        payerEmail: "test_user@testuser.com",
      };

      // Dispara a ETAPA 2 (Confirmação e Geração do Checkout Pro)
      const paymentResponse = await fetch(
        `http://192.168.1.189:3000/api/order/${order_id}/confirm`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(confirmPayload),
        },
      );

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || "Erro ao iniciar o pagamento.");
      }

      // Redireciona para o Checkout Pro
      const supported = await Linking.canOpenURL(
        paymentData.sandbox_init_point,
      );
      if (supported) {
        await Linking.openURL(paymentData.sandbox_init_point);
      } else {
        Alert.alert("Erro", "Não foi possível abrir o navegador.");
      }
    } catch (error: any) {
      Alert.alert("Aviso", error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Resumo do Pedido #{order?.id}</Text>

      <View style={styles.card}>
        <Text style={styles.statusLabel}>Status da Ordem:</Text>
        <Text style={styles.statusValue}>{order?.status}</Text>

        <View style={styles.divider} />

        <Text style={styles.itemsHeader}>Itens:</Text>
        <FlatList
          data={order?.order_items}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>
                {item.quantity}x {item.product?.name || "Produto"}
              </Text>
              <Text style={styles.itemPrice}>
                R$ {parseFloat(item.subtotal).toFixed(2).replace(".", ",")}
              </Text>
            </View>
          )}
        />

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalValue}>
            R${" "}
            {order
              ? parseFloat(order.total).toFixed(2).replace(".", ",")
              : "0,00"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.payBtn}
        onPress={handlePayment}
        disabled={isProcessingPayment}
      >
        {isProcessingPayment ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.payBtnText}>Pagar agora via Mercado Pago</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", padding: 20 },
  centered: { justifyContent: "center", alignItems: "center" },
  header: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginBottom: 20,
  },
  statusLabel: { color: "#888", fontSize: 14 },
  statusValue: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 15 },
  itemsHeader: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemText: { color: "#CCC", fontSize: 14, flex: 1 },
  itemPrice: { color: "#FFF", fontSize: 14, fontWeight: "500" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  totalLabel: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  totalValue: { color: "#D32F2F", fontSize: 22, fontWeight: "bold" },
  payBtn: {
    backgroundColor: "#009EE3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  }, // Azul padrão do MP
  payBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
