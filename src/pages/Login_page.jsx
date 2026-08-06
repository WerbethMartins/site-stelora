import { useState } from "react";
import { Link } from "react-router-dom";

// Hooks
import { useMessage } from "../hooks/useMessage";

// Images
import google from "../assets/img/google.png";
import facebook from "../assets/img/facebook.png";
import instagram from "../assets/img/instagram_Color.png";

function Login_page(){
    const { showMessage } = useMessage();
    
    const handleSubmit = (e) => {
        e.preventDefault();

        // FormData captura automaticamente todos os inputs que têm o atributo "name"
        const formData = new FormData(e.currentTarget);

        const userLogin = {
            email: formData.get("email"),
            password: formData.get("password"),
        };

        showMessage("Usuário logado com sucesso!");

        console.log("Usuário pronto para o firebase:", userLogin);
    }

    return(
        <>
            <section className="login__section">
                <h1 className="title">Sterola</h1>
                <form onSubmit={handleSubmit} className="login__form">
                    <div className="form_header">
                        <h2>Entre com a sua conta</h2>
                        <p style={{ color: "#948a8a" }}>Insira seu e-mail e senha para se conectar.</p>
                    </div>
                    <div className="form_body">
                        <div className="input-group">
                            <input name="email" type="email" id="email" placeholder="Digite seu e-mail" />
                        </div>
                        <div className="input-group">
                            <input name="password" type="password" id="password" placeholder="Digite sua senha" />
                        </div>
                        <div className="input-group">
                            <Link to="/forget-password">Esqueceu a senha?</Link>
                            <button type="submit" className="input-group__btn">Entrar</button>
                        </div>
                    </div>
                    <div className="form_footer">
                        <p style={{ fontSize: "1.2rem" }}>------------------ ou ------------------</p>
                        <div className="social_login">
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
                        <div>
                            <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
                        </div>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Login_page;