import { useState } from "react";
import { Link } from "react-router-dom";

// Components
import { CartIconWithBadge } from "./CartIconWithBadge";

// Imagens
import hamburguer from '../assets/img/menu-hamburguer(white).png';
import close from '../assets/img/icons8-excluir-30.png';
import shoppingBag from '../assets/img/shopping-bag (white heart).png';

// Context
import { useCart } from "../context/CartContext";

function Header(){

    // Variáveis de estado
    const [ menuOpen, setMenuOpen ] = useState(false);

    // Função para alternar a visibilidade do menu em dispositivos móveis
    const toggleMenu = () =>{
         setMenuOpen(!menuOpen);
    };

    return (
        <nav>
            <div className="icon-group">
                <div className="menu_hamburguer" onClick={toggleMenu}>
                    <img src={menuOpen ? close : hamburguer} alt="Menu" className="nav_icon" />
                </div>
                {/* Ícone do carrinho com badge de quantidade de itens */}
                <Link to={`/shopping-bag/${useCart().totalItemsCount > 0 ? useCart().totalItemsCount : ''}`}>
                    <div className="shopping_bag">
                        <CartIconWithBadge />
                        <img src={shoppingBag} alt="Shopping Bag" className="nav_icon" />
                    </div>
                </Link>
            </div>

            {menuOpen && (
                <div className="menu_links">
                        <ul>
                            <li><Link to="/">
                                Home
                            </Link></li>
                            <li><Link to="/catalog">
                                Catalogo
                            </Link></li>
                            <li><Link to="/modelos">
                                3D Modelos
                            </Link></li>
                        </ul>
                </div>
            )}
        </nav>
    )
}

export default Header;