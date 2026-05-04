import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
// Importamos o hook do carrinho para dar vida ao botão
import { useCart } from "./CartContext";

// --- DADOS DE EXEMPLO ---
const COMBOS = [
  {
    id: "001",
    title: "Combo Churrasco Família",
    price: "R$ 149,90",
    image:
      "https://via.placeholder.com/300x150/8B0000/FFFFFF?text=Combo+Familia",
  },
  {
    id: "002",
    title: "Kit Picanha Premium",
    price: "R$ 199,90",
    image: "https://via.placeholder.com/300x150/8B0000/FFFFFF?text=Kit+Premium",
  },
];

const CATEGORIES = [
  { id: "001", name: "Bovinos" },
  { id: "002", name: "Suínos" },
  { id: "003", name: "Aves" },
  { id: "004", name: "Kits" },
  { id: "005", name: "Acessórios" },
];

// Ajustado para bater com a tipagem do CartContext (price como number, adição de stock)
const PRODUCTS = [
  {
    id: "001",
    name: "Picanha Argentina (1kg)",
    price: 98.9,
    stock: 10,
    image: "https://via.placeholder.com/150/1e1e1e/FFFFFF?text=Carne",
  },
  {
    id: "002",
    name: "Costela Suína BBQ",
    price: 45.9,
    stock: 5,
    image: "https://via.placeholder.com/150/1e1e1e/FFFFFF?text=Carne",
  },
  {
    id: "003",
    name: "Linguiça Artesanal",
    price: 32.9,
    stock: 15,
    image: "https://via.placeholder.com/150/1e1e1e/FFFFFF?text=Carne",
  },
  {
    id: "004",
    name: "Bife Ancho (500g)",
    price: 65.9,
    stock: 8,
    image: "https://via.placeholder.com/150/1e1e1e/FFFFFF?text=Carne",
  },
];

export default function IMeatPrimeHome() {
  const [cartOpen, setCartOpen] = useState(false);

  // Extraímos os métodos e dados do carrinho
  const { addToCart, cart } = useCart();

  // Calcula quantos itens totais existem no carrinho para o badge
  const totalItemsInCart = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    // O <CartProvider> foi removido daqui pois já está no _layout.tsx
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* HEADER FIXO */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          I MEAT <Text style={styles.logoAccent}>PRIME</Text>
        </Text>
      </View>

      {/* CONTEÚDO ROLÁVEL */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* BANNER CARROSSEL (Combos) */}
        <View style={styles.section}>
          <FlatList
            data={COMBOS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.bannerCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.bannerImage}
                />
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerPrice}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* CATEGORIAS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <FlatList
            data={CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* PRODUTOS (Todos) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossos Produtos</Text>
          <View style={styles.productsGrid}>
            {PRODUCTS.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                {/* Formatando o preço numérico para exibição */}
                <Text style={styles.productPrice}>
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </Text>

                {/* Botão integrado com a action do Observer */}
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => addToCart(product)}
                >
                  <Text style={styles.buyButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Adicione o contentContainerStyle para dar um respiro no final da lista */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        ></ScrollView>
      </ScrollView>

      {/* A navegação inferior nativa foi removida, o Expo Router cuida disso agora */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    zIndex: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  logoAccent: {
    color: "#D32F2F",
  },
  cartButton: {
    padding: 5,
    position: "relative",
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -5,
    backgroundColor: "#D32F2F",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  cartDropdown: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  cartDropdownText: {
    color: "#AAA",
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingLeft: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  bannerCard: {
    width: 280,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1E1E1E",
  },
  bannerImage: {
    width: "100%",
    height: 140,
  },
  bannerTextContainer: {
    padding: 12,
    backgroundColor: "#D32F2F",
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerPrice: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  categoryBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    height: 40,
  },
  productPrice: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buyButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
