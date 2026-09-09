import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// Tipagem base do produto (Ajuste os campos se necessário)
export interface Product {
    id: string | number;
    name: string;
    price: number;
    discount?: number;
    image?: string;
    category?: string;
    size?: string;
}

export interface FavoriteItem {
    product: Product;
}

interface FavoritesContextType {
    favItems: FavoriteItem[];
    favorites: Product[];
    favoritesCount: number;
    removeFromFavorites: (productId: string | number) => void;
    toggleFavorite: (product: Product) => void;
    isFavorite: (productId: string | number) => boolean;
}

const STORAGE_KEY = "@ecommerce:favorite_v1";

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Product[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? (JSON.parse(saved) as Product[]) : [];
        } catch {
            return [];
        }
    });

    // Persiste alterações no localstorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        }catch (error) {
            console.error("Erro ao salvar o eu favorito no localstorage:", error);
        }
    }, [favorites]);

    const isFavorite = (productId: string | number) => {
        return favorites.some((item) => String(item.id) === String(productId));
    };

    const removeFromFavorites = (productId: string | number) => {
        setFavorites((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    };

    // Adiciona ou remove um produto dos favoritos 
    const toggleFavorite = (product: Product) => {
        setFavorites((prev) => {
            const exists = prev.some((item) => String(item.id) === String(product.id));
            if(exists) {
                return prev.filter((item) => String(item.id) !== String(product.id));
            }
            return [...prev, product];
        });
    }

    return (
        <FavoritesContext.Provider
            value={{
                favItems: favorites.map((product) => ({ product })),
                favorites,
                favoritesCount: favorites.length,
                toggleFavorite,
                isFavorite,
                removeFromFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites deve ser usado dentro de um FavoritesProvider");
  }
  return context;
};