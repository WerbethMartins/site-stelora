import { Link } from "react-router-dom";

import Header from "../components/Main_header";
import { useAuth } from "../context/AuthContext";
import crownIcon from "../assets/img/crown.png";
import starIcon from "../assets/img/estrela.png";
import highlightBackground from "../assets/img/Highlight_background.jpg";
import starLight from "../assets/img/star.png";
import watch from "../assets/img/stopwatch.png";

// Mock Products
import { MOCK_PRODUCTS as PRODUCTS_DATA } from "../data/mockProducts";

function Home() {
    const { isAdmin } = useAuth();
    const exclusiveProduct = PRODUCTS_DATA.find((product) => product.enphasis && product.exclusive);
    const bgImage = exclusiveProduct?.image || highlightBackground;

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
                        The right fragrance turns moments into memories. Leave your mark wherever you go!
                    </p>
                </div>

                <div className="hero__actions">
                    <button
                        type="button"
                        className="hero__explore-btn hero__btn"
                        style={{ backgroundColor: "#eb9a21" }}
                    >
                        Explore Collection
                    </button>

                    {isAdmin && (
                        <Link to="/catalog">
                            <button
                                type="button"
                                className="hero__sign-btn hero__btn"
                                style={{ backgroundColor: "#e03b7f" }}
                            >
                                Adicionar produto exclusivo
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
