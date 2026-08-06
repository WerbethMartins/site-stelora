import { useState } from "react";
import { Link } from "react-router-dom";

// Images
import bell from "../assets/img/bell.png";
import arrow from "../assets/img/arrow.png";
import google from "../assets/img/google.png";
import facebook from "../assets/img/facebook.png";
import instagram from "../assets/img/instagram_Color.png";

// Hooks
import { useMessage } from "../hooks/useMessage";

function Register_page(){
    const { showMessage } = useMessage();

    const handleSubmit = (e) => {
        e.preventDefault();

        // FormData captura automaticamente todos os inputs que têm o atributo "name"
        const formData = new FormData(e.currentTarget);

        const userRegister = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        showMessage("Usuário criado com sucesso!");

        console.log("Usuário pronto para o firebase:", userRegister);
        
    }

    return(
        <>
            <section className="register-form__section">
                <div className="register-form__top">
                    <Link to="/login">
                        <button type="button" className="form__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <div className="form__header-title-group">
                        <h1 className="form__title">Registro</h1>
                        <button type="button" className="form__icon-btn">
                            <img className="form__icon" src={bell} alt="Notificações" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-form__header">
                        <h1>Crie sua conta</h1>
                    </div>
                    <div className="register-form__social_register">
                        <button type="button" className="social_button">
                            <img src={google} alt="Botão do google" />
                        </button>
                        <button type="button" className="social_button">
                            <img src={facebook} alt="Botão do facebook" />
                        </button>
                        <button type="button" className="social_button">
                            <img src={instagram} alt="Botão do instagram" />
                        </button>
                    </div>
                    <div className="register-form__input">
                        <input name="name" type="text" placeholder="Nome do Usuário" required />
                        <input name="email" type="text" placeholder="Email do Usuário" required />
                        <input name="password" type="text" placeholder="Senha do Usuário" required />
                    </div>
                    <div className="register-form__button-section">
                        <button type="submit"  className="button-section__btn">Registrar</button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Register_page;