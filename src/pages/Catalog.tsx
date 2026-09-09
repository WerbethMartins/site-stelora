import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

// Components
import Categories from "../components/Categories";
import { Loading } from "../components/Loading";
import { NotificationPopover } from "../components/NotificationPopover";
import { ProductCard } from "../components/ProductCard";
import { FavoriteIconWithBadge } from "../components/FavoriteIconWithBadge";

//Context
import { useNotifications } from "../context/NotificationContext";

// Services & types
import { getProducts, type Product } from "../service/ProductService";

// Images
import shopping_bag from "../assets/img/shopping-bag (white heart).png";
import bell from "../assets/img/bell.png";
import searchIcon from "../assets/img/search.png";
import arrow from "../assets/img/arrow.png";

function Catalog() {
    // Parâmetros de busca da URL 
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get("category"); // Retorna '3d' ou null

    const { unreadCount } = useNotifications();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setsearchQuery] = useState("");

    // Fecha o popover se o usuário clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent){
            if(popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsPopoverOpen(false);
            }
        }

        if (isPopoverOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPopoverOpen]);

    // Carrega os produtos do Firestore ao montar o componente
    useEffect(() => {
        async function fetchProducts() {
            try{
                setLoading(true);
                const data = await getProducts();

                await new Promise((resolve) => setTimeout(resolve, 2000));

                setProducts(data);
            }catch(error){
                console.error("Erro ao carregar catálogo:", error);
            }finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if(loading){
        return <Loading message="Buscando produtos no catálogo..." />
    }

    if(!products) {
        return(
            <div className="not-found-container">
                <h2>Produto não encontrado</h2>
                <p>O produto que você procura não existe ou foi removido.</p>
                <Link to="/catalog">Voltar ao catálogo</Link>
            </div>
        );
    }

    const availableCategories = [
        "All", 
        ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))
    ];

    const filteredProducts = products.filter((product) => {
        const matchesUrlCategory = !categoryFilter || product.category === categoryFilter;

        const matchesSelectedCategory = selectedCategory === "All" || product.category === selectedCategory;

        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchesUrlCategory && matchesSelectedCategory && matchesSearch;
    });

    return (
        <>
            <section className="catalog">

                <div className="catalog__header">
                    <Link to="/">
                        <button type="button" className="catalog__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <div className="catalog__header-title-group">
                        <h1 className="catalog__title">Catalogo</h1>

                        <Link to="/favorites" aria-label="Abrir página de favoritos">
                            <button
                                type="button" 
                                className="catalog__icon-btn"
                                aria-label="Bag de favoritos"
                                style={{backgroundColor: "#eb9a21"}}
                            > 
                                <FavoriteIconWithBadge />  
                                <img 
                                    className="catalog__icon" 
                                    src={shopping_bag} 
                                    alt="Image de sacola de favoritos" 
                                    style={{width: "30px", height: "30px"}}
                                />
                            </button>
                        </Link>
                        
                        {/* Botão de Notificação com Badge */}
                        <div style={{ position: "relative" }}>
                            <button
                                type="button"
                                className="catalog__icon-btn"
                                onClick={() => setIsPopoverOpen((prev) => !prev)}
                                aria-label="Abrir Notificações"
                            >
                                <img className="catalog__icon" src={bell} alt="Notificações" />

                                {/* Badge de notificações não lidas */}
                                {unreadCount > 0 && (
                                <span className="catalog__notification-badge">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                                )}
                            </button>

                            {/* Painel Dropdown */}
                            {isPopoverOpen && (
                                <NotificationPopover onClose={() => setIsPopoverOpen(false)} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="catalog__search-bar">
                    <div className="catalog__search-input-wrapper">
                        <img src={searchIcon} className="catalog__search-icon" alt="Pesquisar" />
                        <input 
                            type="text"
                            placeholder="Pesquisar Produtos..."
                            value={searchQuery}
                            onChange={(e) => setsearchQuery(e.target.value)}
                            className="catalog__search-input" 
                        />
                    </div>
                    {/*<button type="button" className="catalog__filter-btn">
                        <img src={filter} alt="Filtros" />
                    </button>
                    */}
                </div>

                <Categories
                    categories={availableCategories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem"}}>Carregando produto</div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem"}}>Nenhum produto encontrado.</div>
                ) : (
                    <div className="catalog__grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default Catalog;
