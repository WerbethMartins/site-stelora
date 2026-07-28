import product_1 from "../assets/img/product_1.png";

export interface Product {
    id: number;
    name: string;
    price: number;
    discount?: number;
    image: string;
    category: string;
    type: 'cosmetic' | '3d';
    size?: string;
    description?: string;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Rose Luxury Perfume",
        price: 85,
        discount: 17,
        image: product_1,
        category: "Best Sellers",
        type: "cosmetic",
        size: "7.60 / 255ml",
        description: "Uma fragrância marcante com notas florais elegantes."
    },
    {
        id: 2,
        name: "Citrus Fresh Scent",
        price: 60,
        image: product_1,
        category: "New Arrivals",
        type: "3d",
        size: "7.60 / 255ml",
        description: "Impresso em PLA ecológico com acabamento acetinado."
    }
]