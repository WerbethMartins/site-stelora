import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Context
import { useAuth } from "../context/AuthContext";

// Images
import heartBag  from "../assets/img/shopping-bag (white heart).png";
import arrow from "../assets/img/arrow.png";
import productImage from "../assets/img/product_1.png";
import more from "../assets/img/orange-more-icon.png";
import less from "../assets/img/less-orange-icon.png";

// Components 
import { CartIconWithBadge } from "../components/CartIconWithBadge";

// Context
import { useCart } from "../context/CartContext";
import { OrderService } from "../service/OrderService";
import { useMessage } from "../hooks/useMessage";

// Helper para a formatação de moeda BRL
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

function Shopping_bag() {
    const { user } = useAuth();
    const userId = user?.uid;

    const { cart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();
    const { showMessage } = useMessage();

    // Estados para a simulação de pagamento
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Pix");
    const [isProcessing, setIsProcessing] = useState(false);

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

    // Função para simular a aprovação do pagamento e salvar no Firestore
    async function handleFinishPurchase() {
        if (!userId) {
            alert("Você precisa estar logado para finalizar a compra.");
            return;
        }

        try {
            setIsProcessing(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            const newOrderId = await OrderService.createOrder({
            userId,
            paymentMethod: "Pix",
            shippingMethod: "Entrega expressa (Sedex)",
            address: {
                recipientName: user?.displayName || user?.email || "Nome não informado",
                street: "Rua Sete de Setembro",
                number: "1500",
                complement: "Apto 402",
                city: "Blumenau",
                state: "SC",
                zipCode: "89010-202"
            },
            items: cart.map(item => ({
                id: String(item.product.id),
                product: item.product as unknown as Parameters<typeof OrderService.createOrder>[0]["items"][number]["product"],
                quantity: item.quantity,
                price: item.product.discount
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price
            })),
            total: totalCostNumber,
        });

        // Limpar o carrinho e redirecionar para a página de "Meus Pedidos"
        if(clearCart) clearCart;
        setShowPaymentModal(false);
        navigate("/meus-pedidos");

        showMessage(`Pedido criado com sucesso! Código: ${newOrderId}`);
        } catch (error) {
            alert("Falha ao registrar pedido. Tente novamente.");
        } finally {
            setIsProcessing(false);
        }
    }

    if(cart.length === 0){
        return(
            <section className="shopping-bag" style={{display: "flex", justifyContent: "flex-start"}}>
                <div className="shopping-bag__header">
                    <Link to="/catalog">
                        <button type="button" className="shopping-bag__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <h2 className="header__title">Shopping Bag</h2>
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
                                            <div className="discount">
                                                {product.discount ? (
                                                    <>
                                                        <span  className="discount_tag">-{product.discount}%</span>
                                                        <span className="discount__original-price">{formatCurrency(product.price)}</span>
                                                    </>
                                                ): null}
                                            </div>
                                        </div>

                                        <div className="product-information__footer">
                                            <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                                                {formatCurrency(itemTotalPrice)}
                                            </p>
                                            
                                            <div className="item__choose-QTD">
                                                <button
                                                    type="button"
                                                    className="choose-QTD__btn"
                                                    onClick={() => updateQuantity(product.id, quantity - 1)}
                                                >
                                                    <img src={less} alt="Diminuir quantidade" />
                                                </button>
                                                    <p style={{ color: "#fff", fontSize: "20px" }}>{quantity}</p>
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
                        <button 
                            type="button" 
                            className="button-section__btn"
                            onClick={() => setShowPaymentModal(true)}
                        >
                            Continuar para o pagamento
                        </button>
                    </div>
                </footer>
            </section>

            {/* Modal Simulado de Checkout / Pagamento Fake */}
            {showPaymentModal && (
                <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.75)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                    padding: "20px",
                }}
                >
                <div
                    style={{
                    backgroundColor: "#222",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    maxWidth: "400px",
                    width: "100%",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    }}
                >
                    <h3 style={{ marginBottom: "16px", fontSize: "1.2rem" }}>
                    Simulação de Pagamento
                    </h3>

                    <p style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "16px" }}>
                    Escolha a forma de pagamento para testar a gravação no Firestore:
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                    {["Pix", "Cartão de Crédito", "Boleto Bancário"].map((method) => (
                        <label
                        key={method}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "12px",
                            borderRadius: "8px",
                            border: paymentMethod === method ? "2px solid #ff6b00" : "1px solid #444",
                            cursor: "pointer",
                            backgroundColor: paymentMethod === method ? "#2a2a2a" : "transparent",
                        }}
                        >
                        <input
                            type="radio"
                            name="payment"
                            value={method}
                            checked={paymentMethod === method}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <span>{method}</span>
                        </label>
                    ))}
                    </div>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setShowPaymentModal(false)}
                        style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#444",
                        color: "#fff",
                        cursor: "pointer",
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleFinishPurchase}
                        style={{
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: isProcessing ? "#888" : "#ff6b00",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: isProcessing ? "not-allowed" : "pointer",
                        }}
                    >
                        {isProcessing ? "Aprovando..." : `Confirmar R$ ${totalCostNumber.toFixed(2)}`}
                    </button>
                    </div>
                </div>
                </div>
            )}
        </>
    )
}

export default Shopping_bag;
