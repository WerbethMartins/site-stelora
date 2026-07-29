import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

type MessageType = "success" | "error" | "info" | "warning";

interface Message {
    id: number;
    text: string;
    type: MessageType;
}

interface MessageOptions {
    duration?: number;
    type?: MessageType;
}

interface MessageContextType {
    message: Message | null;
    hideMessage: () => void;
    showMessage: (text: string, options?: MessageOptions) => void;
    showSuccess: (text: string, duration?: number) => void;
    showError: (text: string, duration?: number) => void;
    showInfo: (text: string, duration?: number) => void;
    showWarning: (text: string, duration?: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<Message | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const clearMessageTimeout = useCallback(() => {
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const hideMessage = useCallback(() => {
        clearMessageTimeout();
        setMessage(null);
    }, [clearMessageTimeout]);

    const showMessage = useCallback(
        (text: string, options: MessageOptions = {}) => {
            const { duration = 3000, type = "info" } = options;

            clearMessageTimeout();
            setMessage({
                id: Date.now(),
                text,
                type,
            });

            timeoutRef.current = window.setTimeout(() => {
                setMessage(null);
                timeoutRef.current = null;
            }, duration);
        },
        [clearMessageTimeout],
    );

    const value = useMemo(
        () => ({
            message,
            hideMessage,
            showMessage,
            showSuccess: (text: string, duration?: number) =>
                showMessage(text, { duration, type: "success" }),
            showError: (text: string, duration?: number) =>
                showMessage(text, { duration, type: "error" }),
            showInfo: (text: string, duration?: number) =>
                showMessage(text, { duration, type: "info" }),
            showWarning: (text: string, duration?: number) =>
                showMessage(text, { duration, type: "warning" }),
        }),
        [hideMessage, message, showMessage],
    );

    return (
        <MessageContext.Provider value={value}>
            {children}
            <MessageToast />
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);

    if (!context) {
        throw new Error("useMessage deve ser usado dentro de um MessageProvider");
    }

    return context;
};

const MessageToast = () => {
    const context = useContext(MessageContext);

    if (!context?.message) {
        return null;
    }

    const { message, hideMessage } = context;

    return (
        <div className={`message-toast message-toast--${message.type}`} role="status">
            <span>{message.text}</span>
            <button
                type="button"
                className="message-toast__close"
                aria-label="Fechar mensagem"
                onClick={hideMessage}
            >
                x
            </button>
        </div>
    );
};
