import { Link } from "react-router-dom";

// Images
import heartBag  from "../assets/img/shopping-bag (white heart).png";
import arrow from "../assets/img/arrow.png";
import productImage from "../assets/img/product_1.png";
import more from "../assets/img/orange-more-icon.png";
import less from "../assets/img/less-orange-icon.png";

// Components 
import { CartIconWithBadge } from "../components/CartIconWithBadge";

import { useCart } from "../context/CartContext";

function Shopping_bag() {
    const { cart, updateQuantity } = useCart();

    // Cálculo de desconto dinâmico se existir
    const subtotalNumber = cart.reduce((sum, item) => {
    const unitPrice = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
        return sum + unitPrice * item.quantity;
    }, 0);

    // Totais calculados dinamicamente
    const shippingCost = cart.length > 0 ? 5.5 : 0;
    const totalCostNumber = subtotalNumber + shippingCost;

    if(cart.length === 0){
        return(
            <section className="shopping-bag" style={{display: "flex", justifyContent: "flex-start"}}>
                <div className="shopping-bag__header">
                    <Link to="/catalog">
                        <button type="button" className="shopping-bag__back-btn">
                        <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <h4 className="header__title">Shopping Bag</h4>
                    <button type="button" className="shopping-bag__icon-btn" aria-label="Sacola vazia">
                        <img className="heart_icon" src={heartBag} alt="Sacola de compra" />
                    </button>
                </div>

                <div style={{ padding: "40px 20px", textAlign: "center" }}>
                    <h2>Sua sacola está vazia</h2>
                    <p style={{ margin: "10px 0 20px 0", color: "#666" }}>
                        Navegue pelo catálogo e adicione seus produtos favoritos!
                    </p>
                    <Link to="/catalog">
                        <button
                            type="button"
                            style={{
                                backgroundColor: "#1a1a1a",
                                color: "#fff",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "12px",
                                cursor: "pointer",
                            }}
                        >
                        Voltar ao catálogo
                        </button>
                    </Link>
                </div>
            </section>
        );
    }
    return (
        <>
            <section className="shopping-bag">
                <div className="shopping-bag__header">
                    <Link to="/catalog">
                        <button type="button" className="shopping-bag__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <h4 className="header__title">Shopping Bag</h4>
                    <button type="button" className="shopping-bag__icon-btn" aria-label="Itens na sacola">
                        <CartIconWithBadge />
                        <img className="heart_icon" src={heartBag} alt="Sacola de compra" />
                    </button>
                </div>

                {/* Renderiza cada item acumulado */}
                <div className="shopping-bag__items">
                    {cart.map((item) => {
                        const { product, quantity } = item;

                        const unitPrice = product.discount
                        ? product.price * (1 - product.discount / 100)
                        : product.price;

                        const itemTotalPrice = unitPrice * quantity;

                        return (
                            <div key={product.id} className="item">
                                <img
                                    className="item__image"
                                    src={product.image || productImage}
                                    alt={product.name}
                                />
                                <div className="item__product-information">
                                    <h2 className="product-information__title">{product.name}</h2>
                                    {product.size && <p style={{ marginLeft: "10px" }}>{product.size}</p>}

                                    <div className="item__price-quantity">
                                        <div className="price-quantity__price-discount">
                                            <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                                            R$ {itemTotalPrice.toFixed(2)}
                                            </p>

                                            {product.discount && (
                                            <>
                                                <p
                                                style={{
                                                    color: "white",
                                                    fontSize: "11px",
                                                    padding: "3px 6px",
                                                    backgroundColor: "#eb9a21",
                                                    borderRadius: "20px",
                                                }}
                                                >
                                                -{product.discount}%
                                                </p>

                                                <p
                                                style={{
                                                    color: "grey",
                                                    fontSize: "15px",
                                                    textAlign: "center",
                                                    backgroundColor: "transparent",
                                                    textDecoration: "line-through",
                                                }}
                                                >
                                                R$ {product.price.toFixed(2)}
                                                </p>
                                            </>
                                            )}
                                        </div>

                                        <div className="item__choose-QTD">
                                            <button
                                                type="button"
                                                className="choose-QTD__btn"
                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                            >
                                                <img src={less} alt="Diminuir quantidade" />
                                            </button>
                                                <p style={{ color: "#000", fontSize: "20px" }}>{quantity}</p>
                                            <button
                                                type="button"
                                                className="choose-QTD__btn"
                                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                            >
                                                <img src={more} alt="Aumentar quantidade" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <footer className="shopping-bag__footer">
                    <div className="footer__sub-total">
                        <h3 className="sub-total__title">Subtotal</h3>
                        <p className="price">R$ {subtotalNumber.toFixed(2)}</p>
                    </div>
                    <div className="footer__shipping">
                        <h3 className="sub-total__title">Entrega</h3>
                        <p className="price">R$ {shippingCost.toFixed(2)}</p>
                    </div>
                    <div className="footer__total">
                        <h3 className="sub-total__title">Total</h3>
                        <p className="price">R$ {totalCostNumber.toFixed(2)}</p>
                    </div>
                    <div className="footer__button-section">
                        <button type="button" className="button-section__btn">
                            Continuar para o pagamento
                        </button>
                    </div>
                </footer>
            </section>
        </>
    )
}

export default Shopping_bag;
