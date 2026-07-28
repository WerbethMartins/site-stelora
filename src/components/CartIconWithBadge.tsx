import React from "react";

import { useCart } from "../context/CartContext";

export const CartIconWithBadge = () => {
    const { totalItemsCount } = useCart();
    
    return (
        <div className="cart-icon-wrapper">
            {/* Exibe o badge apenas se houver pelo menos 1 item */}
            {totalItemsCount > 0 && (
                <span className="cart-icon-badge">
                    {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
            )}
        </div>
    );
};