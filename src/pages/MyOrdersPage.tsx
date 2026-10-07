import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Context
import { useAuth } from "../context/AuthContext";

// Components
import { FavoriteIconWithBadge } from "../components/FavoriteIconWithBadge";
import OrderWhatsappToggle from "../components/OrderWhatsappToggle";

// Hooks
import OrderCardAdmin from "../hooks/OrderCardAdmin";

// Services & types
import { type Order, type OrderStatus } from "../types/Order";
import { OrderService } from "../service/OrderService";

// Image
import arrow from "../assets/img/arrow.png";
import shopping_bag from "../assets/img/shopping-bag (white heart).png";
import searchIcon from "../assets/img/search.png";
import truck from "../assets/img/delivery-truck.png";
import truck2 from "../assets/img/fast-delivery.png";
import downArrow from "../assets/img/down-arrow.png";
import upArrow from "../assets/img/up-arrow.png";
import location from "../assets/img/location 2.png";
import clipboard from "../assets/img/clipboard.png";

function MyOrdersPage() {
    const { user, isAdmin } = useAuth();

    // Estados da lista de pedidos
    const [viewAllAdmin, setViewAllAdmin] = useState(false); 
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    const [openDetails, setOpenDetails] = useState<string | null>(null);
    const [openSeeOrder, setOpenSeeOrder] = useState<string | null>(null);
    const [moreSectionOpen, setMoreSectionOpen] = useState(false);

    const userId = user?.uid;

    // Carrega os pedidos do usuário autenticado
    useEffect(() => {
        async function fetchOrders() {
            if (!userId) return;

            try {
                setLoading(true);

                // Se a opção de admin estiver ativo
                const data = viewAllAdmin
                ? (await OrderService.getAllOrders()).filter((order) => order.userId !== userId)
                : await OrderService.getOrdersByUser(userId);
                setOrders(data);
            }catch(error){
                console.log("Erro ao carregar pedidos: ", error);
            }finally{
                setLoading(false);
            }
        }

        fetchOrders();
    }, [userId, viewAllAdmin])

    // Altera a visibilidade dos cards ao clicar no botão para ver todos os pedidos (apenas para admin)
    const toggleViewAllAdmin = () => {
        setViewAllAdmin((prev) => !prev);
    };

    // Alternar visibilidade de detalhes do pedido
    const toggleDetailsPage = (orderId: string) => {
        setOpenDetails((prev) => (prev === orderId ? null : orderId));
        setOpenSeeOrder(null);
    };
    
    const toggleSeeOrder = (orderId: string) => {
        setOpenSeeOrder((prev) => (prev === orderId ? null : orderId));
        setOpenDetails(null);
    };

    const toggleMorePage = () => {
        setMoreSectionOpen((prev) => !prev);
    };

    // Filtragem de pedidos
    const filteredOrders = orders.filter((order) => {
        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesStatus && matchesSearch;
    });

    // Recarrega a lista depois que o admin muda um status
    const handleStatusUpdated = async () => {
        if (!user?.uid) return;
        const data = await OrderService.getOrdersByUser(user.uid);
        setOrders(data);
    };

    if (loading) {
        return <div className="orders-loading">Carregando seus pedidos...</div>;
    }

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
                        {isAdmin && (
                            viewAllAdmin ? (
                                <button
                                    type="button"
                                    className="orders-header__icon-btn"
                                    style={{backgroundColor: "#ffffff"}}
                                    onClick={toggleViewAllAdmin}
                                >
                                    <img 
                                        src={arrow} 
                                        className="orders-header__icon"
                                        alt="Icone para mostrar os meus pedidos" 
                                        style={{width: "30px", height: "30px"}}
                                    />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="orders-header__icon-btn"
                                    style={{backgroundColor: "#ffffff"}}
                                    onClick={toggleViewAllAdmin}
                                >
                                    <img 
                                        src={clipboard} 
                                        className="orders-header__icon"
                                        alt="Icone para mostrar todos os pedidos" 
                                        style={{width: "30px", height: "30px"}}
                                    />
                                </button>
                            )
                        )}
                    </div>
                </div>
                <div className="orders-body">
                    <div className="orders-body__header">
                       <div className="header__search-status">
                            <button
                                type="button"
                                className={`header-status__btn ${statusFilter === "ALL" ? "active" : ""}`}
                                onClick={() => setStatusFilter("ALL")}
                            >
                                Todos
                            </button>
                            <button
                                type="button"
                                className={`header-status__btn ${statusFilter === "IN_PROCESS" ? "active" : ""}`}
                                onClick={() => setStatusFilter("IN_PROCESS")}
                            >
                                Em Processo
                            </button>
                            <button
                                type="button"
                                className={`header-status__btn ${statusFilter === "FINISHED" ? "active" : ""}`}
                                onClick={() => setStatusFilter("FINISHED")}
                            >
                                Concluídos
                            </button>
                       </div>
                       <div className="header__search-bar">
                            <div className="catalog__search-input-wrapper">
                                <img src={searchIcon} className="catalog__search-icon" alt="Pesquisar" />
                                <input
                                    className="search-bar__input"
                                    type="text"
                                    placeholder="Buscar por código ou produto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                       </div>
                    </div>
                    {/* Lista de Pedidos */}
                    {filteredOrders.length === 0 ? (
                        <div className="orders-empty">
                            <h2>Nenhum pedido encontrado.</h2>
                        </div>
                    ): (
                        filteredOrders.map((order)=> {
                            const isDetailsOpen = openDetails === order.id;
                            const isSeeOrderOpen = openSeeOrder === order.id;

                            return (
                                <div key={order.id} className="orders-body__card">
                                    <div className="card__header">
                                        <div className="header__status">
                                            <p><strong>Status atual:</strong></p>
                                            <span className="header__process">{order.statusLabel}</span>
                                            {/* Painel do admin para trocar o status */}
                                            {isAdmin && (
                                                <OrderCardAdmin order={order} onStatusUpdated={handleStatusUpdated} />
                                            )}
                                            <div className="header__local">
                                                <img src={truck} style={{ width: "20px", marginRight: "5px" }} alt="Caminhão" />
                                                <span>{order.address.city} - {order.address.state}</span>
                                            </div>
                                        </div>

                                        <div className="header__details">
                                            <div className="header__details-info">
                                                <p>Order:</p>
                                                <p
                                                    style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                                                >
                                                    #{order.id}
                                                </p>
                                            </div>
                                            <div className="header__details-btn">
                                                <button
                                                    type="button"
                                                    className="details-btn__btn"
                                                    style={{ backgroundColor: "#007bff", color: "#fff" }}
                                                    onClick={() => toggleDetailsPage(order.id)}
                                                >
                                                    {isDetailsOpen ? "Voltar" : "Detalhes"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="details-btn__btn"
                                                    style={{ backgroundColor: "#eb9a21", color: "#fff" }}
                                                    onClick={() => toggleSeeOrder(order.id)}
                                                >
                                                    {isSeeOrderOpen ? "Ocultar Pedido" : "Ver Pedido"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resumo Inicial do Pedido (Itens principais) */}
                                    {!isDetailsOpen && !isSeeOrderOpen && (
                                        <div className="card__body">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="card-body__img-price">
                                                    <img
                                                        className="card-body__img"
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                    />
                                                    <div className="card-body__information">
                                                        <h2>{item.product.name}</h2>
                                                        <p style={{ fontSize: "0.9rem" }}>
                                                            {order.estimatedDelivery ? `Previsão: ${order.estimatedDelivery}` : "Entregue"}
                                                        </p>
                                                        <div className="card-body__price">
                                                            <span>R$ {item.price.toFixed(2)}</span>
                                                            <span>Qtd: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Painel de Detalhes do Pedido */}
                                    {isDetailsOpen && (
                                        <div className="order-details">
                                            <div className="order-details__information">
                                                <h4 className="order-information__title">Informações do Pedido</h4>
                                                <div className="order-details__number order__information">
                                                    <p>Número do pedido</p>
                                                    <p>#{order.id}</p>
                                                </div>
                                                <div className="order-details__total order__information">
                                                    <p>Total</p>
                                                    <p>R$ {order.total.toFixed(2)}</p>
                                                </div>
                                                <div className="order-details__time order__information">
                                                    <p>Data do pedido</p>
                                                    <p>{new Date(order.createdAt).toLocaleString("pt-BR")}</p>
                                                </div>
                                                <div className="order-details__pay order__information">
                                                    <p>Método de Pagamento</p>
                                                    <p>{order.paymentMethod}</p>
                                                </div>
                                                <div className="order-details__shipping order__information">
                                                    <p>Método de Envio</p>
                                                    <p>{order.shippingMethod}</p>
                                                </div>
                                                <div className="order-details__address">
                                                    <p>Endereço de Faturamento</p>
                                                    <p>{order.address.street}, {order.address.number}</p>
                                                    <p>{order.address.city} {order.address.state} - Brasil {order.address.zipCode}</p>
                                                </div>
                                            </div>

                                            <div className="order-details__more-information">
                                                <div className="more-information__header">
                                                    <h4 className="more-information__title">Mais</h4>
                                                    <button
                                                        type="button"
                                                        className="header__btn"
                                                        onClick={toggleMorePage}
                                                    >
                                                        <img
                                                            className="more-information__img"
                                                            src={moreSectionOpen ? upArrow : downArrow}
                                                            alt="Alternar mais opções"
                                                        />
                                                    </button>
                                                </div>
                                                {moreSectionOpen && (
                                                    <button type="button" className="more-information__identical-btn">
                                                        Ver Semelhantes
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Painel "Ver Pedido" / Acompanhamento de Entrega */}
                                    {isSeeOrderOpen && (
                                        <div className="see-order-section">
                                            <div className="see-order__header">
                                                <div className="header__shipping-date">
                                                    <img className="shipping-date__img" src={truck2} alt="Entrega" />
                                                    <p>Entrega |</p>
                                                    <span className="shipping-date__date">
                                                        {order.estimatedDelivery || "Em transporte"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="see-order__address">
                                                <img className="address__img" src={location} alt="Localização" />
                                                <div className="address__information">
                                                    <span>
                                                        {order.address.street}, {order.address.number} | {order.address.city} - {order.address.state}
                                                    </span>
                                                    <p className="information-paragraph">{order.address.recipientName}</p>
                                                </div>
                                            </div>
                                            <div className="see-order__card-order">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="card-order__body">
                                                        <h4 style={{ background: "#eb9a21", padding: "3px 8px", borderRadius: "5px", color: "#fff" }}>
                                                            {order.statusLabel}
                                                        </h4>
                                                        <div className="body__img-price">
                                                            <img className="body__img" src={item.product.image} alt={item.product.name} />
                                                            <div className="body__information">
                                                                <h2>{item.product.name}</h2>
                                                                <div className="body__price">
                                                                    <span>R$ {item.price.toFixed(2)}</span>
                                                                    <span>Qtd: {item.quantity}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {user && !isAdmin && (
                                                <OrderWhatsappToggle order={order} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }) 
                            
                    )}
                </div>
            </section>
        </>
    );
}

export default MyOrdersPage;