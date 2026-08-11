import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { app } from "../configuracao/FirebaseConfig";
import { auth } from "../service/AuthService";

type UserRole = "admin" | "user";

interface AuthContextType {
    user: User | null;
    userRole: UserRole | null;
    isAdmin: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const db = getFirestore(app);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setUserRole(null);
                setIsLoading(false);
                return;
            }

            try {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                const role = userDocSnap.exists() ? userDocSnap.data().role : "user";

                setUserRole(role === "admin" ? "admin" : "user");
            } catch (error) {
                console.error("Erro ao buscar a role do usuário:", error);
                setUserRole("user");
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const value = useMemo(
        () => ({
            user,
            userRole,
            isAdmin: userRole === "admin",
            isLoading,
        }),
        [isLoading, user, userRole],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
};
