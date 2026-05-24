import { Product } from "@/entities/Products";
import React, { createContext, useState, useContext } from "react";

export type CartItem = Product & { quantity: number };

interface CartContextData {
	cart: CartItem[];
	addToCart: (product: Product) => void;
	removeFromCart: (productId: string) => void;
	clearCart: () => void;
	totalPrice: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [cart, setCart] = useState<CartItem[]>([]);
	const clearCart = () => setCart([]);

	const addToCart = (product: Product) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) {
				// Trava a adição se já atingiu o máximo do estoque disponível
				if (existing.quantity >= product.stock) return prev;
				return prev.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				);
			}
			return [...prev, { ...product, quantity: 1 }];
		});
	};

	const removeFromCart = (productId: string) => {
		setCart((prev) => {
			const existing = prev.find((item) => item.id === productId);
			// Se tiver apenas 1, remove completamente do array
			if (existing?.quantity === 1) {
				return prev.filter((item) => item.id !== productId);
			}
			// Caso contrário, diminui a quantidade
			return prev.map((item) =>
				item.id === productId
					? { ...item, quantity: item.quantity - 1 }
					: item,
			);
		});
	};

	const totalPrice = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	return (
		<CartContext.Provider
			value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}
		>
			{children}
		</CartContext.Provider>
	);
};

// Hook customizado atuando como uma interface limpa para os componentes
export const useCart = () => useContext(CartContext);
