import { useCart } from "../context/CartContext";

export const CartIconWithBadge = () => {
    const { totalItemsCount } = useCart();
    
    return (
        <span className="cart-icon-wrapper" aria-hidden="true">
            {/* Exibe o badge apenas se houver pelo menos 1 item */}
            {totalItemsCount > 0 && (
                <span className="cart-icon-badge">
                    {totalItemsCount > 99 ? "99+" : totalItemsCount}
                </span>
            )}
        </span>
    );
};
