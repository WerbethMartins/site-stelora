import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { app } from "../configuracao/FirebaseConfig";

// Initialize Firestore
const db = getFirestore(app);

export interface Product {
    id?: string;
    name: string;
    price: number;
    discount: number;
    category: string;
    typeSize: string;
    size: string;
    description: string;
    image: string;
    exclusive: boolean;
    enphasis: boolean;
    imgExclusive: string;
    createdAt: any;
}

// Salva um novo produdo no FireStore
export async function addProduct(productData: Omit<Product, 'id' | 'createdAt'>) {
    try{
        const docRef = await addDoc(collection(db, "products"), {
            ...productData,
            createdAt: serverTimestamp()
        });

        return docRef.id;
    }catch(error){
        console.error("Erro ao cadastrar produto:", error);
        throw error;
    }
}

// Busca todos os produtos cadastrados
export async function getProducts(): Promise<Product[]> {
    try{
        const querySnapshot = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
        const products: Product[] = [];

        querySnapshot.forEach((doc) => {
            // Adiciona o produto ao array, incluindo o ID do documento
            products.push({ id: doc.id, ...doc.data() } as Product);
        });

        return products;
    } catch(error){
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
}

// Deletar um produto
export async function deleteProduct(ProductId: string): Promise<void> {
    try {
        // Deletar o produto do Firestore
        await deleteDoc(doc(db, "products", ProductId));
    }catch(error){
        console.error("Erro ao deletar produto:", error);
        throw error;
    }

}

// Favoritar um produto
export async function toggleProductExclusive(
    productId: string, 
    newExclusiveStatus: boolean, 
    imgExclusive?: string | null
): Promise<void> {
    try {
        const productRef = doc(db, "products", productId);

        await updateDoc(productRef, {
            exclusive: newExclusiveStatus,
            enphasis: newExclusiveStatus,
            // Se estiver ativando e houver imagem nova, salva ela. Se desativar, limpa ou mantém.
            imgExclusive: newExclusiveStatus ? (imgExclusive || null) : null
        });
    } catch (error) {
        console.error("Erro ao alterar destaque do produto:", error);
        throw error;
    }
}