import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCart } from "./CartContext"; // Ajuste o caminho se necessário

export default function CarrinhoScreen() {
  const { cart, addToCart, removeFromCart, totalPrice } = useCart();

  // Estado para controlar o botão de checkout e evitar cliques duplos
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      // 1. Formata os dados no padrão do seu CreateOrderDto
      const orderPayload = {
        // user_id e address_id podem ser null por enquanto, já que é MVP
        items: cart.map((item) => ({
          product_id: Number(item.id), // Garantindo que o backend receba como número
          quantity: item.quantity,
        })),
        guest_name: "Cliente",
        guest_email: "test_user@testuser.com",
        guest_phone: "71912345678",
      };

      // 2. ETAPA 1: Cria a Ordem (Reserva o estoque no MariaDB)
      const orderResponse = await fetch("http://192.168.10.11:3000/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Erro ao criar o pedido.");
      }

      const order = await orderResponse.json();

      // 3. ETAPA 2: Confirma a Ordem (Gera o link no Mercado Pago)
      const confirmPayload = {
        method: "PIX",
        payerEmail: "test@testuser.com", // Mockado por enquanto
      };

      const paymentResponse = await fetch(
        `http://192.168.10.11:3000/api/order/${order.id}/confirm`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(confirmPayload),
        },
      );

      console.log(await paymentResponse.json());

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.message || "Erro ao gerar o pagamento.");
      }

      const { sandbox_init_point } = await paymentResponse.json();

      // 4. Redireciona para o Checkout Pro
      const supported = await Linking.canOpenURL(sandbox_init_point);
      if (supported) {
        await Linking.openURL(sandbox_init_point);
      } else {
        Alert.alert("Erro", "Não foi possível abrir a tela de pagamento.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Aviso",
        error.message || "Não foi possível finalizar a compra.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Seu Pedido</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Seu carrinho está vazio.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </Text>
              </View>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => removeFromCart(item.id)}
                >
                  <Text style={styles.controlText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.controlBtn,
                    item.quantity >= item.stock && styles.disabledBtn,
                  ]}
                  onPress={() => addToCart(item)}
                  disabled={item.quantity >= item.stock}
                >
                  <Text style={styles.controlText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>
          R$ {totalPrice.toFixed(2).replace(".", ",")}
        </Text>
      </View>

      {/* Botão de Finalizar Compra atualizado com a lógica de carregamento */}
      <TouchableOpacity
        style={[styles.checkoutBtn, cart.length === 0 && styles.disabledBtn]}
        disabled={cart.length === 0 || isCheckingOut}
        onPress={handleCheckout}
      >
        {isCheckingOut ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.checkoutText}>Finalizar Compra</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A", padding: 20 },
  header: { color: "#FFF", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  empty: { color: "#777", fontSize: 16, textAlign: "center", marginTop: 50 },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  info: { flex: 1 },
  name: { color: "#FFF", fontSize: 16 },
  price: { color: "#D32F2F", fontSize: 14, fontWeight: "bold", marginTop: 5 },
  controls: { flexDirection: "row", alignItems: "center" },
  controlBtn: {
    backgroundColor: "#333",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  disabledBtn: { opacity: 0.5 },
  controlText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  quantity: { color: "#FFF", marginHorizontal: 15, fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: "#333",
  },
  totalText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  totalPrice: { color: "#D32F2F", fontSize: 22, fontWeight: "bold" },
  checkoutBtn: {
    backgroundColor: "#D32F2F",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  checkoutText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
