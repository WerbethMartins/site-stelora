import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { logOut } from "../service/AuthService";
import { CartIconWithBadge } from "./CartIconWithBadge";

// Imagens
import close from "../assets/img/icons8-excluir-30.png";
import hamburguer from "../assets/img/menu-hamburguer(white).png";
import shoppingBag from "../assets/img/shopping-bag (white heart).png";
import userIcon from "../assets/img/user.png";
import addProduct from "../assets/img/Add(2).png";

function Header() {
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userSectionOpen, setUserSectionOpen] = useState(false);
    const isLoggedIn = !!user;

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const toggleUserSection = () => {
        setUserSectionOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await logOut();
            setUserSectionOpen(false);
            navigate("/login");
        } catch (error) {
            console.error("Falha ao deslogar", error);
        }
    };

    return (
        <nav>
            <div className="icon-group">
                <div className="menu_hamburguer" onClick={toggleMenu}>
                    <img src={menuOpen ? close : hamburguer} alt="Menu" className="nav_icon" />
                </div>

                <div className="icon-group__icons">
                    {isLoggedIn && (
                        <Link to="/cart" aria-label="Abrir sacola de compras">
                            <div className="icon-group__shopping_bag">
                                <CartIconWithBadge />
                                <img src={shoppingBag} alt="Shopping Bag" className="nav_icon" />
                            </div>
                        </Link>
                    )}

                    <div className="icon-group__user-btn" onClick={toggleUserSection}>
                        <img src={userIcon} alt="User Icon" />
                    </div>
                </div>
            </div>

            {userSectionOpen && (
                <div className="user-section">
                    {isAdmin && (
                        <Link to="/admin/product-form" className="user-section__admin-link">
                            <img src={addProduct} className="user-section__add-product" alt="Icon de adicionar produto" />
                        </Link>
                    )}
                    
                    <button onClick={handleLogout} className="user-section__logout-btn">
                        Sair
                    </button>
                </div>
            )}

            {menuOpen && (
                <div className="menu_links">
                    <ul>
                        <div className="menu-links__header">
                            <li className="menu-links__item active">
                                <Link to="/" aria-label="Ir para a página inicial">
                                    Home
                                </Link>
                            </li>

                            {isAdmin && (
                                <li className="menu-links__item-admin">
                                    <Link to="/admin/product-form" aria-label="Ir para cadastro de produto">
                                        Admin
                                    </Link>
                                </li>
                            )}
                        </div>
                        <li className="menu-links__item">
                            <Link to="/catalog" aria-label="Ir para o catálogo">
                                Catalogo
                            </Link>
                        </li>
                        <li className="menu-links__item">
                            <Link to="/modelos" aria-label="Ir para os modelos 3D">
                                3D Modelos
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Header;
