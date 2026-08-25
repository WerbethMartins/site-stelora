import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Context
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../context/AuthContext";

// Hooks
import { useMessage } from "../hooks/useMessage";

// Services & types
import { deleteProduct, type Product, toggleProductExclusive } from "../service/ProductService";

// Images
import heartOutline from "../assets/img/White heart.png"
import heartFilled from "../assets/img/Red-heart.png";   // Ícone de coração preenchido
import favorite from "../assets/img/estrela.png";
import menuHamburguer from "../assets/img/menu-hamburguer(white).png";
import delet from "../assets/img/close.png"
import { compressImage } from "../utils/CompressImage";

interface ProductCardProps {
  product: Product;
}

// Função para formatar a moeda
const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const { showMessage } = useMessage();
    const [products, setProducts] = useState<Product[]>([]);
    const [openMenuProductId, setOpenMenuProductId] = useState<string | null>(null);
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorited = product.id == null ? false : isFavorite(product.id);
    const [formProductExclusive, setFormProductExclusive] = useState(false);
    const [selectedProductForExclusive, setSelectedProductForExclusive] = useState<Product | null>(null);

    // Ref para disparar o upload de arquivo escondido
    const fileInputRef = useRef<HTMLInputElement | null>(null); 

    // Função para guarda o produto na fila para excluir
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const { isAdmin } = useAuth();

    const toggleFormProductExclusive = () => {
            setFormProductExclusive((prev) => !prev);
        }
    
    const toggleMenuIcons = (productId: string) => {
        setOpenMenuProductId((prev) => (prev === productId ? null : productId));
    };

    // Abre e fecha o popup passando o ID
    const handleOpenDeleteModal = (productId: string) => {
        setProductToDelete(productId);
    };

    const handleCloseDeleteModal = () => {
        setProductToDelete(null);
    };

    // Exclui o produto quando o usuário clica em sim
    const handleConfirmDelete = async () => {
        if(!productToDelete) return;

        try {
            await deleteProduct(productToDelete);
            setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productToDelete));
            showMessage("produto excluido com sucesso!");
        }catch(error){
            console.error("Erro ao excluir o produto", error);
            showMessage("Erro ao tentar excluir o produto");
        }finally {
            setProductToDelete(null);
        }
    }

    // Desativa o destaque
    const handleRemoveExclusive = async (product: Product) => {
        try {
            await toggleProductExclusive(String(product.id), false);
            setProducts((prev) =>
                prev.map((p) => {
                    if (p.id !== product.id) return p;

                    return { ...p, exclusive: false, enphasis: false };
                })
            );

            showMessage("Produto removido dos destaques.");
        }catch(error) {
            showMessage("Erro ao remover o destaque.");
        }
    }

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

    const applyExclusiveUpdate = async (product: Product, imgExclusive: string) => {
        try {
            await toggleProductExclusive(product.id!, true, imgExclusive);

            setProducts((prev) =>
            prev.map((p) => {
                    if (p.id === product.id) {
                        return { ...p, exclusive: true, enphasis: true, imgExclusive };
                    }
                    const { imgExclusive: _imgExclusive, ...rest } = p;
                    return { ...rest, exclusive: false, enphasis: false } as Product;
                })
            );

            showMessage("Novo produto definido como o único destaque da Home!");

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
            navigate("/home");
        }catch (error) {
            showMessage("Erro ao processar a imagem de destaque.");
        }finally {
            // Limpa a ref
            event.target.value = "";
        }
    }

    // Cálculo do preço final com desconto
    const finalPrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

  return (
    <div className="product-card">
        <div className="product-card__header">
            <div className="product-card__favorite-icon">
                {/* Verificação se o usuário é admin */}
                {isAdmin ? (
                    <>
                        {/* Ícone de menu para admin */}
                        <button type="button" className="product-card__icon" onClick={() => toggleMenuIcons(product.id!)}>
                            <img
                                style={{ width: "20px", height: "20px" }} 
                                src={menuHamburguer} alt="Menu" 
                            />
                        </button>
                        {openMenuProductId === product.id  && (
                            <div className="admin-icons__icons">
                                <button type="button" className="favorite_icon product-card__icon" onClick={toggleFormProductExclusive}>
                                    <img
                                        style={{ width: "20px", height: "20px" }}  
                                        src={favorite} alt="Favoritar"
                                    />
                                </button>
                                <button 
                                    type="button" 
                                    className="delete_icon product-card__icon" 
                                    onClick={() => handleOpenDeleteModal(product.id!)} 
                                    aria-label="Excluir produto">
                                        <img 
                                            style={{width: "20px", height: "20px"}} 
                                            src={delet} alt="Icone de delete" 
                                        />
                                </button>
                            </div>
                        )}
                    </>
                ): (
                    <div className="favorite-icon">
                        <button
                            type="button"
                            onClick={() => {
                                if (product.id == null) return;
                                toggleFavorite({ ...product, id: product.id });
                            }} 
                            aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"} >
                                <img className="heart_icon product-card__icon" src={favorited ? heartFilled : heartOutline} alt="Favorite" />
                        </button>
                    </div>
                )}
            </div>

            {/* POPUP DE CONFIRMAÇÃO DE EXCLUSÃO */}
            {productToDelete && (
            <div className="confirm-modal-overlay" onClick={handleCloseDeleteModal}>
                <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                    <h3 className="confirm-modal__title">Atenção</h3>
                    <p className="confirm-modal__message">Deseja realmente excluir o produto {product.name}?</p>

                    <div className="confirm-modal__actions">
                        <button
                            type="button"
                            className="confirm-modal__btn confirm-modal__btn--cancel"
                            onClick={handleCloseDeleteModal}
                        >
                        Não
                        </button>
                        <button
                            type="button"
                            style={{background: "#d9534f", color: "#fff"}}
                            className="confirm-modal__btn confirm-modal__btn--confirm"
                            onClick={handleConfirmDelete}
                        >
                        Sim
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* Formulário indepêndente */}    
            {formProductExclusive && (
                <div className="catalog__exclusive-form">
                    <h2 className="exlusive-form__title">Produto Destaque</h2>
                    <form className="exclusive-form__title">
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

            {product.discount ? (
                <span className="product-card__discount-badge">
                    -{product.discount}%
                </span>
            ) : ""}
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
                    <p className="product-card__price" style={{ fontSize: "1.1rem" }}>R${product.price}</p>
                    {product.discount ? (
                        <p className="product-card__final-price" style={{ fontSize: "1rem" }}>
                            {formatCurrency(finalPrice(product.price, product.discount))}
                        </p>
                    ): ""}
                </div>
            </div>
        </div>
    </div>
  );
}