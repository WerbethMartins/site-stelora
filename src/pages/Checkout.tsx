import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

// Components
import { CartIconWithBadge } from "../components/CartIconWithBadge";

// Images
import arrow from "../assets/img/white_back.png";
import heartOutline from "../assets/img/White heart.png";
import heartFilled from "../assets/img/Red-heart.png";
import shopping_bag from "../assets/img/shopping-bag.png";
import more from "../assets/img/plus-sign.png";
import less from "../assets/img/minus.png";
import Printer from "../assets/img/3d-printing.png";

// Service e Context
import { type Product, getProducts } from "../service/ProductService";
import { useCart } from "../context/CartContext";
import { useMessage } from "../hooks/useMessage";
import { Loading } from "../components/Loading";
import { useFavorites } from "../context/FavoriteContext";

function Checkout() {
    // Pega o id vindo da URL (ex: /checkout/1)
    const { id } = useParams(); 

    // Busca o produto cujo id coincide com o id da URL
    const [products, setProduct] = useState<Product[]>([]);
    
    const product = products.find((item) => String(item.id) === String(id));

    // Controle de estado do favorito
    const { isFavorite, toggleFavorite } = useFavorites();
    const productId = product?.id;
    const favorited = productId == null ? false : isFavorite(productId);

    const { addToCart } = useCart();
    const { showMessage } = useMessage();
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    // Converter para String/Number conforme o tipo do mock
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const products = await getProducts();
                setProduct(products);
            }catch(error) {
                console.error("Erro ao buscar produto:", error)
            }finally{
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    if (loading) {
        return <Loading message="Buscando informações do produto..." />;
    }

    if (!product) {
        return (
            <div className="not-found-container">
                <div className="not-found-icon">
                    <img src={Printer} alt="Icone de erro 404" />
                </div>

                <span className="not-found-code">404</span>

                <h2>Essa impressão não saiu como esperado...</h2>

                <p>
                    O produto que você procura não foi encontrado.
                    Talvez ele tenha sido removido, esteja temporariamente
                    indisponível ou o endereço esteja incorreto.
                </p>

                <div className="not-found-actions">
                    <Link to="/catalog">
                        <button type="button" className="btn-primary">Ver catálogo</button>
                    </Link>
                </div>

                <small>
                    Não se preocupe, ainda temos muitas peças esperando por você.
                </small>
            </div>
        );
    }

    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    // Função para adicionar ao carrinho e redirecionar
    const handleAddToCart = () => {
        addToCart(product as unknown as import("../data/mockProducts").Product, quantity);
        showMessage(`${quantity} item(ns) de ${product.name} adicionado(s) à sacola`);

        // Redireciona o usuário para a sacola de compras para ver o item adicionado
        navigate("/cart");
    }

    // Cálculo de desconto dinâmico se existir (usar number para operações)
    const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    // Atualizar valor finalPrice com base na quantidade
    const totalPrice = (finalPrice * quantity).toFixed(2);

    return (
        <>
            <section className="checkout" style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${product.image})`, 
                    width: "100%",
                    height: "100vh",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}>
                
                <div className="checkout__header">
                    <Link to="/catalog">
                        <button type="button" className="checkout__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <button 
                        type="button"
                        onClick={() => {
                            if (product.id == null) return;
                            toggleFavorite({ ...product, id: product.id });
                            showMessage(favorited ? "Produto removido dos favoritos!" : "Produto adicionado aos favoritos!");
                        }}
                        className="checkout__icon-btn" aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"} >
                        <img className="heart_icon" src={favorited ? heartFilled : heartOutline} alt="Favorite" />
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
                                R${totalPrice}
                            </p>
                            {product.discount ? (
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
                                    R${product.price.toFixed(2)}
                                </p>
                            </>
                            ) : ""}
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
