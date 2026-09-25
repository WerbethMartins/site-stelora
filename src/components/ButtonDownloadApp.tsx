import { Link } from "react-router-dom";

// Images
import download_icon from "../assets/img/Logo_download.png";

function ButtonDownloadApp(){
    return(
        <>
           <div className="button-Download__btn">
                <Link to="/download-app">
                    <button 
                        className="btn"
                        type="button"
                        aria-label="Botão da página de download do App "
                    >
                        <img src={download_icon} className="image_btn" alt="Icone do App" />
                    </button>
                </Link>
           </div>
        </>
    );
}

export default ButtonDownloadApp;