import { Link } from "react-router-dom";

// Components
import { FavoriteIconWithBadge } from "../components/FavoriteIconWithBadge";

// Image
import arrow from "../assets/img/arrow.png";
import shopping_bag from "../assets/img/shopping-bag (white heart).png";
import searchIcon from "../assets/img/search.png";

function MyOrdersPage() {
    return (
        <>
            <section className="orders__section">
                <div className="orders__header">
                    <Link to="/">
                        <button type="button" className="orders__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>

                    <div className="orders__header-title-group">
                        <h1 className="Order-header__title">Meus Pedidos</h1>

                        <Link to="/favorites" aria-label="Abrir página de favoritos">
                            <button
                                type="button" 
                                className="orders-header__icon-btn"
                                aria-label="Bag de favoritos"
                                style={{backgroundColor: "#eb9a21"}}
                            > 
                                <FavoriteIconWithBadge />  
                                <img 
                                    className="orders-header__icon" 
                                    src={shopping_bag} 
                                    alt="Image de sacola de favoritos" 
                                    style={{width: "30px", height: "30px"}}
                                />
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="orders-body">
                    <div className="orders-body__header">
                       <div className="header__status">
                             <button type="button" className="header-status__btn">Todos</button>
                            <button type="button" className="header-status__btn">Em Processo</button>
                            <button type="button" className="header-status__btn">Concluidos</button>
                       </div>
                       <div className="header__search-bar">
                            <div className="catalog__search-input-wrapper">
                                <img src={searchIcon} className="catalog__search-icon" alt="Pesquisar" />
                            </div>
                       </div>
                    </div>
                    <div className="orders-body__card">
                            <div className="card__header">
                                <div className="header__status">
                                    <p>Status: Em Processo</p>
                                </div>
                                <div className="header__details">
                                    <div>
                                        <p>Order:</p>
                                    </div>
                                    <div>
                                        <p>#123456789</p>
                                    </div>
                                    <div className="header__details-btn">
                                        <button type="button" className="details-btn__btn" aria-label="Botão de detalhes do pedido">
                                            Detalhes
                                        </button>
                                        <button type="button" className="details-btn__btn" aria-label="Botão de ver pedido">
                                            Ver Pedido
                                        </button>
                                    </div>
                                </div>
                            </div>
                       </div>
                </div>
            </section>
        </>
    );
}

export default MyOrdersPage;