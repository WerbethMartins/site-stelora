import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Components
import Categories from "../components/Categories";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../hooks/useMessage";

// Services & types
import { getProducts, type Product, deleteProduct, toggleProductExclusive } from "../service/ProductService";

// Images
import bell from "../assets/img/bell.png";
import searchIcon from "../assets/img/search.png";
import filter from "../assets/img/filter.png";
import heartOutline from "../assets/img/White heart.png";
import arrow from "../assets/img/arrow.png";
import favorite from "../assets/img/estrela.png";
import start from "../assets/img/star.png";
import menuHamburguer from "../assets/img/menu-hamburguer(white).png";
import delet from "../assets/img/close.png"
import { compressImage } from "../utils/CompressImage";

const categories = ["All", "Best Sellers", "New Arrivals"];

function Catalog() {
    const [menuIcons, setMenuIcons] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [searchQuery, setsearchQuery] = useState("");

    const [formProductExclusive, setFormProductExclusive] = useState(false);
    const [selectedProductForExclusive, setSelectedProductForExclusive] = useState<Product | null>(null);

    // Ref para disparar o upload de arquivo escondido
    const fileInputRef = useRef<HTMLInputElement | null>(null); 

    const { isAdmin } = useAuth();
    const { showMessage } = useMessage();

    const toggleFormProductExclusive = () => {
        setFormProductExclusive((prev) => !prev);
    }

    const toggleMenuIcons = () => {
        setMenuIcons((prev) => !prev);
    };

    // Carrega os produtos do Firestore ao montar o componente
    useEffect(() => {
        async function fetchProducts() {
            try{
                const data = await getProducts();
                setProducts(data);
            }catch(error){
                console.error("Erro ao carregar catálogo:", error);
            }finally {
                setIsLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const handleStarClick = (product: Product) => {
        if (!product.id) return;

        // Se já for exclusivo, desativa direto
        if (product.exclusive) {
            handleRemoveExclusive(product);
        } else {
            // Se vai virar exclusivo, guarda o produto e abre a janela de upload da imagem em destaque
            setSelectedProductForExclusive(product);
            fileInputRef.current?.click();
        }
    };

    // Desativa o destaque
    const handleRemoveExclusive = async (product: Product) => {
        try {
            await toggleProductExclusive(product.id!, false);
            setProducts((prev) =>
                prev.map((p) => {
                    if (p.id !== product.id) return p;

                    const { imgExclusive: _imgExclusive, ...rest } = p;
                    return { ...rest, exclusive: false, enphasis: false } as Product;
                })
            );

            showMessage("Produto removido dos destaques.");
        }catch(error) {
            showMessage("Erro ao remover o destaque.");
        }
    }

    const applyExclusiveUpdate = async (product: Product, imgExclusive: string) => {
        try {
            await toggleProductExclusive(product.id!, true, imgExclusive);

            setProducts((prev) => 
                prev.map((p) => 
                    p.id === product.id
                        ? { ...p, exclusive: true, enphasis: true, imgExclusive }
                        : p
                )
            );
        }catch (error) {
            showMessage("Erro ao atualizar o destaque do produto.");
        }finally {
            setSelectedProductForExclusive(null);
        }
    }

    // Processa o envio da imagem do destaque
    const handleExclusiveImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!selectedProductForExclusive || !selectedProductForExclusive.id) return;
        
        try {
            let featuredImageBase64 = selectedProductForExclusive.image;
            
            if (file) {
                // Comprime a imagem antes de enviar!
                featuredImageBase64 = await compressImage(file, 1200, 0.7);
            }

            await applyExclusiveUpdate(selectedProductForExclusive, featuredImageBase64);
            showMessage("Produto atualizado como destaque com sucesso!");
        }catch (error) {
            showMessage("Erro ao processar a imagem de destaque.");
        }finally {
            // Limpa a ref
            event.target.value = "";
        }
    }

    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
    };

    // Função para deletar o produto do banco e da tela
    const handleDelete = async (productId: string) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir este produto");

        if(!confirmDelete) return;

        try{
            await deleteProduct(productId);
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
            showMessage("Produto removido com sucesso!");
        }catch(error){
            showMessage("Erro ao excluir o produto.");
        }
    }

    // Lógica de filtragem por Categoria e Busca por Texto
    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Cálculo do preço final com desconto
    const finalPrice = (price: number, discount: number) => {
        return (price * (1 - discount / 100)).toFixed(2);
    };


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
                        <h1 className="catalog__title">Catalog</h1>
                        <button type="button" className="catalog__icon-btn">
                            <img className="catalog__icon" src={bell} alt="Notificações" />
                        </button>
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
                    <button type="button" className="catalog__filter-btn">
                        <img src={filter} alt="Filtros" />
                    </button>
                </div>

                <Categories
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                />

                {isLoading ? (
                    <div style={{ textAlign: "center", padding: "2rem"}}>Carregando produto</div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem"}}>Nenhum produto encontrado.</div>
                ) : (
                    <div className="catalog__grid">
                        {filteredProducts.map((product) => (
                            <div className="product-card">
                                <div className="product-card__header">
                                    <div className="product-card__favorite-icon">
                                        {/* Verificação se o usuário é admin */}
                                        {isAdmin ? (
                                            <>
                                                {/* Ícone de menu para admin */}
                                                <button type="button" className="product-card__icon" onClick={toggleMenuIcons}>
                                                    <img
                                                        style={{ width: "20px", height: "20px" }} 
                                                        src={menuHamburguer} alt="Menu" 
                                                    />
                                                </button>
                                                {menuIcons && (
                                                    <div className="admin-icons__icons">
                                                        <button type="button" className="favorite_icon product-card__icon" onClick={toggleFormProductExclusive}>
                                                            <img
                                                                style={{ width: "20px", height: "20px" }}  
                                                                src={favorite} alt="Favoritar" 
                                                            />
                                                        </button>
                                                        <button type="button" className="delete_icon product-card__icon" onClick={() => handleDelete(product.id!)}>
                                                            <img 
                                                                style={{width: "20px", height: "20px"}} 
                                                                src={delet} alt="Icone de delete" 
                                                            />
                                                        </button>
                                                    </div>
                                                )}

                                            </>
                                        ): (
                                            <div className="admin-icons__icons">
                                                <img className="heart_icon product-card__icon" src={heartOutline} alt="Favorite" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Formulário indepêndente */}    
                                    {formProductExclusive && (
                                        <div className="catalog__exlusive-form">
                                            <h2 className="exlusive-form__title">Produto Destaque</h2>
                                            <form className="catalog__exclusive-form">
                                                <p style={{color: "#eb9a21", fontSize: "1.4rem", borderBottom: "1px solid #ccc"}}>Escolha imagem de destaque</p>
                                                <input 
                                                    type="file"
                                                    ref={fileInputRef}
                                                    accept="image/*"
                                                    className="exclusive-form__img-input"
                                                    onChange={handleExclusiveImageUpload}
                                                />
                                                <button type="button" className="exclusive-form__btn" onClick={() => handleStarClick(product)}>Escolher imagem</button>
                                            </form>
                                        </div>
                                    )}

                                    {product.discount && (
                                        <span className="product-card__discount-badge">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                <Link to={`/checkout/${product.id}`} style={{ textDecoration: 'none' }} key={product.id}>
                                    <div className="product-card__body">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-card__image"
                                        />
                                    </div>
                                </Link>

                                <div className="product-card__footer">
                                    <div className="product-card__info">
                                        <h4 className="product-card__name">{product.name}</h4>
                                        <div className="prices_section">
                                            <p className="product-card__price" style={{ fontSize: "1.1rem" }}>${product.price}</p>
                                            {product.discount && (
                                                <p className="product-card__final-price" style={{ fontSize: "1rem" }}>
                                                    ${finalPrice(product.price, product.discount)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

export default Catalog;
