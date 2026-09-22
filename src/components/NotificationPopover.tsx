import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

// Images
import { useState } from "react";

interface Props {
    onClose: () => void;
}

type FilterType = 'all' | "unread";

export const NotificationPopover: React.FC<Props> = ({ onClose }) => {
    const { notifications, unreadCount,markAsRead, markAllAsRead } = useNotifications();
    const [filter, setFilter] = useState<FilterType>("all");
    const navigate = useNavigate();
    

    // Filtra as notificações de forma de dinamica com base na aba ativa
    const filteredNotifications = notifications.filter((item) => {
        if(filter === "unread") return !item.read;
        return true;
    })
 
    const handleNotificationClick = (id: string, productId?: string | number) => {
        markAsRead(id);

        if (productId != null) {
            navigate(`/checkout/${productId}`);
        }
        onClose();
    };

    return (
        <div className="notification-popover">
            <div className="notification-popover__header">
                <h3 className="notification-popover__title">Notificações</h3>
            </div>

            {/* Abas de filtros */}
            <div className="notification-popover__tabs">
                {unreadCount > 0 && (
                    <button type="button" onClick={markAllAsRead} className="tab-btn notification-popover__read-all">
                        Marcar lidas
                    </button>
                )}
                <button
                    type="button"
                    className={`tab-btn ${filter === "all" ? "tab-btn--active" : ""}`}
                    onClick={() => setFilter("all")}
                    >
                    Todas ({notifications.length})
                </button>
                <button
                    type="button"
                    className={`tab-btn ${filter === "unread" ? "tab-btn--active" : ""}`}
                    onClick={() => setFilter("unread")}
                    >
                    Não lidas ({unreadCount})
                </button>
            </div>

            <div className="notification-popover__list">
                {filteredNotifications.length === 0 ? (
                    <p className="notification-popover__empty">
                        {filter === "unread"
                            ? "Nenhuma notificação não lida."
                            : "Nenhuma notificação por enquanto."
                        }
                    </p>
                    ) : (
                    filteredNotifications.map((item) => (
                        <div
                            key={item.id}
                            className={`notification-item ${!item.read ? "notification-item--unread" : ""} ${item.productId == null ? "notification-item--disabled" : ""}`}
                            onClick={() => handleNotificationClick(item.id, item.productId)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    handleNotificationClick(item.id, item.productId);
                                }
                            }}
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
