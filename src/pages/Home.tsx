import { Link } from "react-router-dom";

import Header from "../components/Main_header";
import { useAuth } from "../context/AuthContext";
import { getProducts, type Product } from "../service/ProductService";

// Images
import crownIcon from "../assets/img/crown.png";
import starIcon from "../assets/img/estrela.png";
import highlightBackground from "../assets/img/Highlight_background.jpg";
import starLight from "../assets/img/star.png";
import watch from "../assets/img/stopwatch.png";
import { useEffect, useState } from "react";


function Home() {
    const { isAdmin } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Busca os produtos do Firebase ao carregar a página
    useEffect(() => {
        async function fetchHomeProducts(){
            try {
                const data = await getProducts();
                setProducts(data);
            }catch(error){
                console.error("Erro ao carregar produto em destaque:", error);
            }finally {
                setLoading(false);
            }
        }

        fetchHomeProducts();
    }, []);

    // Encontra o produto marcado como exclusivo/destaque
    const exclusiveProduct = products.find((product) => product.exclusive)

    const bgImage = exclusiveProduct?.imgExclusive || exclusiveProduct?.image || highlightBackground;

    return (
        <section
            className="hero"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
            }}
        >
            <Header />

            <div className="hero__container">
                <div className="hero__badge">
                    <img src={starIcon} alt="Estrela" className="hero__badge-icon" />
                    <span className="hero__badge-text">Edição Exclusiva</span>
                </div>

                <div className="hero__content">
                    <h1 className="hero__title">
                        {exclusiveProduct ? exclusiveProduct.name : "Find Your Signature Scent"}
                    </h1>
                    <p className="hero__subtitle">
                        {exclusiveProduct?.description 
                            ? exclusiveProduct.description 
                            : "The right fragrance turns moments into memories. Leave your mark wherever you go!"
                        }
                    </p>
                </div>

                <div className="hero__actions">
                    <Link to={exclusiveProduct?.id ? `/checkout/${exclusiveProduct.id}` : "/catalog"}>
                        <button
                            type="button"
                            className="hero__explore-btn hero__btn"
                            style={{ backgroundColor: "#eb9a21" }}
                        >
                            {exclusiveProduct ? "Explorar Coleção" : "Produto não existe catalogo"}
                        </button>
                    </Link>

                    {isAdmin && (
                        <Link to="/catalog">
                            <button
                                type="button"
                                className="hero__sign-btn hero__btn"
                                style={{ backgroundColor: "#e03b7f" }}
                            >
                                Gerenciar Destaques
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="hero_footer">
                <div className="hero_footer_item">
                    <div className="item item_1">
                        <img src={crownIcon} alt="icone" />
                        <h4>Premiun Quality</h4>
                    </div>
                    <div className="item item_2">
                        <img src={watch} alt="icone" />
                        <h4>Long Fragrance</h4>
                    </div>
                    <div className="item item_3">
                        <img src={starLight} alt="icone" />
                        <h4>Organized Package</h4>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
