import { Link } from "react-router-dom";

// Components
import { CartIconWithBadge } from "../components/CartIconWithBadge";

// Context & Hooks
import { useFavorites } from "../context/FavoriteContext";
import { useMessage } from "../hooks/useMessage";

// Assets
import arrow from "../assets/img/arrow.png";
import bag from "../assets/img/shopping-bag.png";
import defaultProductImage from "../assets/img/product_1.png";

// Helper para a formatação de moeda BRL
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

function FavoritePage() {
  const { favItems, removeFromFavorites } = useFavorites();
  const { showMessage } = useMessage();

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await removeFromFavorites(productId);
      showMessage("Produto removido dos favoritos com sucesso!");
    } catch (error) {
      console.error("Erro ao tentar excluir um favorito!", error);
      showMessage("Erro ao tentar excluir um favorito!");
    }
  };

  return (
    <section className="favorite-page__container">
      <header className="favorite-page__header">
        <Link to="/catalog">
          <button type="button" className="favorite-bag__back-btn" aria-label="Voltar ao catálogo">
            <img src={arrow} alt="Voltar" />
          </button>
        </Link>

        <h1 className="header__title">Favoritos</h1>

        <button type="button" className="header__icon-btn" aria-label="Ver sacola de compras">
          <CartIconWithBadge />
          <img src={bag} alt="Sacola de produtos" />
        </button>
      </header>

      <div className="favorite-page__items">
        {favItems.length === 0 ? (
          <div className="favorite-page__empty-state">
            <h2>Você não tem favoritos</h2>
            <p>Navegue pelo catálogo e adicione seus produtos nos favoritos!</p>
            <Link to="/catalog">
              <button type="button" className="favorite-page__catalog-btn">
                Voltar ao catálogo
              </button>
            </Link>
          </div>
        ) : (
          favItems.map(({ product }) => {
            const unitPrice = product.discount
              ? product.price * (1 - product.discount / 100)
              : product.price;

            return (
              <div key={product.id} className="item">
                <img
                  className="item__image"
                  src={product.image || defaultProductImage}
                  alt={product.name}
                />

                <div className="item__product-information">
                  <h2 className="product-information__title">{product.name}</h2>
                  {product.size && (
                    <span className="product-information__size">{product.size}</span>
                  )}

                  <div className="item__price-quantity">
                    <div className="price-quantity__price-discount">
                      {product.discount ? (
                        <div className="discount">
                          <span className="discount__tag">-{product.discount}%</span>
                          <span className="discount__original-price">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="product-information__footer">
                      <p className="product-information__price">
                        {formatCurrency(unitPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="item__button-section">
                    <Link to={`/checkout/${product.id}`} className="button-section__link">
                      <button type="button" className="button-section__btn">
                        Adicionar à sacola
                      </button>
                    </Link>

                    <button
                      type="button"
                      className="button-section__delete-btn"
                      onClick={() => handleRemoveFavorite(String(product.id))}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default FavoritePage;