import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useCart } from "./CartContext";
import { Product } from "@/entities/Products";
import { api } from "@/services/api";
import { loadActiveProducts } from "@/hooks/loadProducts";

// Tipagem baseada no retorno do seu NestJS
interface BackendProduct {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: string; // Vem como string do banco
  stock: number;
  is_active: boolean;
  images: any[]; // Array de imagens
}

export default function ProductScreen() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveProducts({ setProducts, setIsLoading });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cortes Disponíveis</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D32F2F" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.price}>
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </Text>
                <Text
                  style={[styles.stock, item.stock === 0 && styles.outOfStock]}
                >
                  {item.stock > 0 ? `Estoque: ${item.stock} un` : "Esgotado"}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  item.stock === 0 && styles.buttonDisabled,
                ]}
                onPress={() => addToCart(item)}
                disabled={item.stock === 0}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  price: {
    color: "#D32F2F",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  stock: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  outOfStock: {
    color: "#D32F2F",
  },
  button: {
    backgroundColor: "#D32F2F",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#333",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 20,
  },
});
