import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { app } from "../configuracao/FirebaseConfig";
import { where } from "firebase/firestore/lite";

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

        if (newExclusiveStatus) {
            const batch = writeBatch(db);

            // Busca todos os produtos que atualmente estão como exclusivos
            const exclusiveQuery = query(collection(db, "products"), where("exclusive", "==", true));
            const querySnapshot = await getDocs(exclusiveQuery);

            // Desmarca todos os produtos antigos encontrados
            querySnapshot.forEach((docSnap) => {
                if (docSnap.id !== productId) {
                    batch.update(docSnap.ref, {
                        exclusive: false,
                        enphasis: false,
                        imgExclusive: null
                    });
                }
            });

            // Define o produto atual como o novo e único exclusivo
            batch.update(productRef, {
                exclusive: true,
                enphasis: true,
                imgExclusive: imgExclusive || null
            });

            // Executa todas as alterações de uma só vez
            await batch.commit();
        } else {
            // Se estiver apenas desativando o produto atual
            await updateDoc(productRef, {
                exclusive: false,
                enphasis: false,
                imgExclusive: null
            });
        }
    } catch (error) {
        console.error("Erro ao alterar destaque do produto:", error);
        throw error;
    }
}