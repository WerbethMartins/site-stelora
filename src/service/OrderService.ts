import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { app } from "../configuracao/FirebaseConfig";

const db = getFirestore(app);

import { type Order, type OrderStatus } from "../types/Order";


export const STATUS_LABELS: Record<OrderStatus, string> = {
  IN_PROCESS: "Em Processo",
  IN_TRANSIT: "Em Transporte",
  FINISHED: "Concluído",
  CANCELED: "Cancelado"
};

export const OrderService = {

    async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusLabel'>): Promise<string> {
        try{
            const docRef = await addDoc(collection(db, "orders"), {
                ...orderData,
                status: "IN_PROCESS",
                statusLabel: STATUS_LABELS.IN_PROCESS,
                createdAt: serverTimestamp(),
            });

            return docRef.id;
        }catch (error){
            console.log("Erro ao criar pedido no Firestore:", error);
            throw error;
        }
    },

    // Busca todos os pedidos do usuário informado
    async getOrdersByUser(userId: string): Promise<Order[]>{
        try{
            const q = query(
                collection(db, "orders"),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const orders: Order[] = [];

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                orders.push({
                    id: docSnap.id,
                    ...data,
                    // Converte o timestamp do Firestore para string ISO/Formatada
                    createdAt: data.createdAt?.toDate() ? data.createdAt.toDate().toISOString() : new Date().toISOString() 
                } as Order);
            })

            return orders;
        }catch (error){
            console.log("Erro ao buscar pedido de usuário", error);
            throw error;
        }
    },

    async getAllOrders(): Promise<Order[]> {
        try{
            const q = query(
                collection(db, "orders"),
                orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            const orders: Order[] = [];

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                orders.push({
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
                } as Order);
            });

            return orders;

        }catch (error){
            console.error("Erro ao buscar todos os pedidos", error);
            throw error;
        }
    },

    // Busca um pedido específico pelo código do pedido
    async gerOrderById(orderId: string): Promise<Order | null> {
        try{
            const docRef = doc(db, "orders", orderId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                const data = docSnap.data();
                return {
                    id: docSnap.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                } as Order;
            }

            return null;
        }catch (error){
            console.log("Erro ao buscar pedido por ID ", error);
            throw error;
        }
    },

    /** Atualiza o status e o rótulo de um pedido no Firestore*/
    async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
        try {
            const orderRef = doc(db, "orders", orderId);

            await updateDoc(orderRef, {
            status: newStatus,
            statusLabel: STATUS_LABELS[newStatus]
            });

            console.log(`Pedido ${orderId} atualizado para ${STATUS_LABELS[newStatus]}`);
        } catch (error) {
            console.error("Erro ao atualizar status do pedido:", error);
            throw error;
        }
    }
}
