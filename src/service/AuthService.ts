import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { app } from "../configuracao/FirebaseConfig";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export const auth = getAuth(app);
const db = getFirestore(app);

// Uma lista com os e-mails que devem ser admins automaticamente
const ADMIN_EMAILS = ["sterolaloja@gmail.com"];

export async function signIn(email: string, password: string){
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    }catch(error){
        console.error("Erro ao entrar");
        throw error;
    }
}

export async function signUp(name: string, email: string, password: string) {
    try {
        // Cria o usuário firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Verifica se o e-mail cadastrado está na lista de admins
        const userRole = ADMIN_EMAILS.includes(email) ? 'admin' : 'user';

        // Foi usado o UID do Auth como ID do documento para ficarem vinculados
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            role: userRole,
            provider: 'email',
            createdAt: new Date()
        })

        return user;
    }catch(error) {
        console.error("Erro no cadastro", error);
        throw error;
    }
}

export async function logOut() {
    try {
        await signOut(auth);
        console.log("Usuário deslogado com sucesso");
    } catch (error) {
        console.error("Erro ao fazer logout", error);
        throw error;
    }
}

export async function signInWithGoogleAccessToken(accessToken: string) {
  try {
    // Firebase aceita access_token como segundo parâmetro
    const credential = GoogleAuthProvider.credential(null, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);

    // Busca o documento do usuário banco antes de salvar~
    const userDocSnap = await getDoc(userDocRef);

    if(!userDocSnap.exists()){
        // Se não existe, é o primeiro login (Cadastro via Google)
        const userEmail = user.email || "";
        const userRole = ADMIN_EMAILS.includes(userEmail) ? 'admin' : 'user';

        await setDoc(
            doc(db, "users", user.uid),
            {
                name: user.displayName || "Usuário Google",
                email: user.email,
                photoURL: user.photoURL,
                role: userRole,
                provider: "google",
                updatedAt: new Date(),
            },
            { merge: true },
        );
    }else {
        // Se já existe, apenas atualiza a data e a foto, mas a role não!
        // Assim o sistema não rebaixa um admin para user.
        await setDoc(userDocRef, {
            photoURL: user.photoURL,
            updatedAt: new Date(),
        }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error("Erro no login com Google", error);
    throw error;
  }
}
