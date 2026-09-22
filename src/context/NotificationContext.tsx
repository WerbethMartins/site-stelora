import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
    productId?: string | number;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<AppNotification, "id" | "date" | "read">) => void;
}

const STORAGE_KEY = "@ecommerce:notifications_v1";

// Dados inicias mockados para testar a interface
const INITIAL_NOTIFICATIONS: AppNotification[] = [ 
    {
        id: "2",
        title: "Promoção relâmpago ⚡",
        message: "Descontos de até 30% em itens selecionados.",
        date: "Ontem",
        read: false,
    },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => 
        prev.map((item) => (item.id === id ? {...item, read: true} : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({...item, read: true})));
  };

  const addNotification = ({ title, message, productId }: Omit<AppNotification, "id" | "date" | "read">) => {
    const newNotif: AppNotification = {
        id: Date.now().toString(),
        title,
        message,
        date: new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
        read: false,
        productId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }

  return (
    <NotificationContext.Provider
        value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            addNotification
        }}
    >

        {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications deve ser usado dentro de um NotificationProvider");
  }
  return context;
};
