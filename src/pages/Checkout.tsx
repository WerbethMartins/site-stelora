import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

// Components
import { CartIconWithBadge } from "../components/CartIconWithBadge";

// Images
import checkoutBg  from "../assets/img/Teste.png";
import arrow from "../assets/img/white_back.png";
import heartOutline from "../assets/img/White heart.png";
import shopping_bag from "../assets/img/shopping-bag.png";
import more from "../assets/img/plus-sign.png";
import less from "../assets/img/minus.png";

// Mock Products e Context
import { MOCK_PRODUCTS as PRODUCTS_DATA } from "../data/mockProducts";
import { useCart } from "../context/CartContext";

function Checkout() {
    // Pega o id vindo da URL (ex: /checkout/1)
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Busca o produto cujo id coincide com o id da URL
    // Converter para String/Number conforme o tipo do mock
    const product = PRODUCTS_DATA.find((item) => String(item.id) === id);

    if (!product) {
        return 
        <div>
            <h2>Produto não encontrado</h2>
            <Link to="/catalog">Voltar ao catálo</Link>
        </div>;

    }

    const [quantity, setQuantity] = useState(1);

    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    // Função para adicionar ao carrinho e redirecionar
    const handleAddToCart = () => {
        addToCart(product, quantity);

        // Redireciona o usuário para a sacola de compras para ver o item adicionado
        navigate(`/shopping-bag/${product.id}`);
    }

    // Cálculo de desconto dinâmico se existir (usar number para operações)
    const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    // Atualizar valor finalPrice com base na quantidade
    const totalPrice = (finalPrice * quantity).toFixed(2);

    return (
        <>
            <section className="checkout" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${product.image})`}}>
                <div className="checkout__header">
                    <Link to="/catalog">
                        <button type="button" className="checkout__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <button type="button" className="checkout__icon-btn">
                        <img className="heart_icon" src={heartOutline} alt="Favorite" />
                    </button>
                </div>
                <div className="checkout__info">
                    <div className="info__header">
                        <h1 className="info__title">{product.name}</h1>
                        <button type="button" className="info__icon-btn" onClick={handleAddToCart}>
                            <CartIconWithBadge />
                            <img src={shopping_bag} alt="Shopping bag" />
                        </button>
                    </div>
                    <div className="info__body">
                        {product.description || "Descrição padrão do produto selecionado."}
                    </div>
                    <div className="info__price-information">
                        {/* Preço de desconto*/}
                        <div className="price">
                            <p style={{color: "black", fontSize: "24px", fontWeight: "bold"}}>
                                {totalPrice}
                            </p>
                            {product.discount && (
                            <>
                                <p 
                                    style={{
                                        color: "white",
                                        fontSize: "12px",
                                        backgroundColor: "#eb9a21",
                                        padding: "2px 6px",
                                        borderRadius: "20px",
                                    }}
                                >
                                    -{product.discount}%
                                </p>

                                <p
                                    style={{
                                        color: "grey",
                                        backgroundColor: "transparent",
                                        textDecoration: "line-through",
                                    }}
                                    >
                                    ${product.price.toFixed(2)}
                                </p>
                            </>
                            )}
                        </div>

                        <div className="info__choose-QTD">
                            <button 
                                type="button" 
                                className="choose-QTD__btn"
                                onClick={handleDecrease}
                            >
                                <img src={less} alt="Botão de menos" />
                            </button>
                            <p style={{color: "#000", fontSize: "20px"}}>{quantity}</p>
                            <button 
                                type="button" 
                                className="choose-QTD__btn"
                                onClick={handleIncrease}
                                >
                                <img src={more} alt="Botão de mais" />
                            </button>
                        </div>
                    </div>
                    <div className="checkout__button-section">
                        {/* Conectado o evento handleAddToCart no clique do botão */}
                        <button
                            type="button"
                            className="button-section__btn"
                            onClick={handleAddToCart}
                        >
                            Adicionar à Sacola
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Checkout;