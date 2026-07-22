import React, { useState } from "react";
import { Link } from "react-router-dom";

// Components
import Categories from "../components/Categories";

// Images
import bell from "../assets/img/bell.png";
import searchIcon from "../assets/img/search.png";
import filter from "../assets/img/filter.png";
import heartOutline from "../assets/img/White heart.png";
import arrow from "../assets/img/arrow.png";

// Mock Products
import { MOCK_PRODUCTS as PRODUCTS_DATA } from "../data/mockProducts";

const categories = ["All", "Best Sellers", "New Arrivals"];

function Catalog() {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [searchQuery, setsearchQuery] = useState("");

    const handleSelectCategory = (category: string) => {
        setSelectedCategory(category);
    };

    // Lógica de filtragem por Categoria e Busca por Texto
    const filteredProducts = PRODUCTS_DATA.filter((product) => {
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
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

                <div className="catalog__grid">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-card__header">
                                <button type="button" className="product-card__favorite-icon">
                                    <img className="heart_icon" src={heartOutline} alt="Favorite" />
                                </button>
                                {product.discount && (
                                    <span className="product-card__discount-badge">
                                        -{product.discount}%
                                    </span>
                                )}
                            </div>

                            <div className="product-card__body">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-card__image"
                                />
                            </div>

                            <div className="product-card__footer">
                                <div className="product-card__info">
                                    <h4 className="product-card__name">{product.name}</h4>
                                    <p className="product-card__price">${product.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Catalog;