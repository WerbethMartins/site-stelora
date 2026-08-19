import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

interface Props {
    onClose: () => void;
}

export const NotificationPopover: React.FC<Props> = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const navigate = useNavigate();

    const handleNotificationClick = (id: string, productId?: string | number) => {
        markAsRead(id);
        if (productId) {
        navigate(`/product/${productId}`);
        }
        onClose();
    };

    return (
        <div className="notification-popover">
            <div className="notification-popover__header">
                <h3>Notificações</h3>
                {notifications.some((n) => !n.read) && (
                <button type="button" onClick={markAllAsRead} className="notification-popover__read-all">
                    Marcar todas como lidas
                </button>
                )}
            </div>

            <div className="notification-popover__list">
                {notifications.length === 0 ? (
                <p className="notification-popover__empty">Nenhuma notificação por enquanto.</p>
                ) : (
                notifications.map((item) => (
                    <div
                    key={item.id}
                    className={`notification-item ${!item.read ? "notification-item--unread" : ""}`}
                    onClick={() => handleNotificationClick(item.id, item.productId)}
                    >
                    <div className="notification-item__content">
                        <strong>{item.title}</strong>
                        <p>{item.message}</p>
                        <span className="notification-item__date">{item.date}</span>
                    </div>
                    {!item.read && <span className="notification-item__badge-dot" />}
                    </div>
                ))
                )}
            </div>
        </div>
    );
};