import { doc, updateDoc } from "firebase/firestore";
import { db } from "../configuracao/FirebaseConfig";
import { type Product, } from "../service/ProductService";

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number; // Preço no momento da compra
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  recipientName: string;
}

export type OrderStatus = "IN_PROCESS" | "IN_TRANSIT" |"FINISHED" | "CANCELED";

export interface Order {
  id: string;
  userId: string,
  userName?: string;
  status: OrderStatus;
  statusLabel: string; 
  createdAt: string; 
  estimatedDelivery?: string;
  total: number;
  whatsappOptIn?: boolean;
  whatsappNumber?: string;
  paymentMethod: string;
  shippingMethod: string;
  address: Address;
  items: OrderItem[];
} 

export async function toggleOrderWhatsapp(
  orderId: string,
  enabled: boolean,
  phone: string
): Promise<void>{
  try {
    const orderRef = doc(db, "orders", orderId);

    await updateDoc(orderRef, {
      whatsappOptIn: enabled,
      ...(phone ? { whatsappNumber: phone } : {})
    });
  }catch (error){
    console.error("Erro ao atualizar a preferencia do WhatsApp");
    throw error;
  }
}