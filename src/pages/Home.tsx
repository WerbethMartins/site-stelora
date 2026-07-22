// Components
import Header from '../components/Main_header';

// Imagens 
import starIcon from '../assets/img/estrela.png';
import scentBg from '../assets/img/golden-hour-perfume-bottle-on-the-beach-a-stunning-sunrise-scent-free-photo.jpeg';
import crownIcon from '../assets/img/crown.png';
import watch from '../assets/img/stopwatch.png';
import starLight from "../assets/img/star.png";

function Home(){
    return (
        <>
            <section 
                className="hero" 
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${scentBg})` }}
                >

                <Header />
                
                <div className="hero__container">
                    
                    {/* Badge Exclusivo */}
                    <div className="hero__badge">
                        <img src={starIcon} alt="Estrela" className="hero__badge-icon" />
                        <span className="hero__badge-text">Exclusivo</span>
                    </div>

                    {/* Conteúdo de Texto */}
                    <div className="hero__content">
                        <h1 className="hero__title">Find Your Signature Scent</h1>
                        <p className="hero__subtitle">
                            The right fragrance turns moments into memories. Leave your mark wherever you go!
                        </p>
                    </div>

                    {/* Ação */}
                    <div className="hero__actions">
                        <button type="button" className="hero__button">
                            Explore Collection
                        </button>
                    </div>
                </div>
                <div className='hero_footer'>
                    <div className='hero_footer_item'>
                        <div className="item item_1">
                            <img src={crownIcon} alt="icone"/>
                            <h4>Premiun Quality</h4>
                        </div>
                        <div className="item item_2">
                            <img src={watch} alt="icone"/>
                            <h4>Long Fragrance</h4>
                        </div>
                        <div className="item item_3">
                            <img src={starLight} alt="icone"/>
                            <h4>Organized Package</h4>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home;