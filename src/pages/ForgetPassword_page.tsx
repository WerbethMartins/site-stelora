import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth } from "../service/AuthService";
import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithGoogleAccessToken } from "../service/AuthService";

import { useMessage } from "../hooks/useMessage";

// Autenticação com o google
import CustomGoogleButton from "../components/CustomGoogleButton";

// Images
import bell from "../assets/img/bell.png";
import arrow from "../assets/img/arrow.png";
import facebook from "../assets/img/facebook.png";
import instagram from "../assets/img/instagram_Color.png";

function forgetPassword_page() {
    const { showMessage } = useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        if(!email){
            showMessage("Por favor, insira um endereço de e-mail válido.");
            return;
        }

        try {
            setIsLoading(true);

            await sendPasswordResetEmail(auth, email);
            showMessage("E-mail de redefinição de senha enviado com sucesso!");
            navigate("/login");
        } catch (error) {
            console.error("Erro ao enviar e-mail de redefinição de senha:", error);
            showMessage("Erro ao enviar e-mail de redefinição de senha. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
        

    return (
        <> 
            <section className="forget-password__section">
                <div className="forget-password_top">
                    <Link to="/login">
                        <button type="button" className="forget-password__back-btn">
                            <img src={arrow} alt="Voltar" />
                        </button>
                    </Link>
                    <div className="form__header-title-group">
                        <h2 className="form__title">Esqueceu a senha</h2>
                        <button type="button" className="form__icon-btn">
                            <img className="form__icon" src={bell} alt="Notificações" />
                        </button>
                    </div>
                </div>

                <form className="forget-password__form" onSubmit={handleSubmit}>
                    <div className="form__header">
                        <h2>Insira seu endereço de e-mail</h2>
                    </div>
                    <div className="form__input">
                        <input name="email" type="email" placeholder="Email do Usuário" required />
                        <div>
                            <p>
                                <Link  style={{color: "#918a8a", textDecoration: "none"}} to="/register">Voltar a página de cadastro</Link>
                            </p>
                        </div>
                        <div className="form__button-section">
                            <button type="submit"  className="button-section__btn">
                                {isLoading ? "Enviando..." : "Enviar"}
                            </button>
                        </div>
                    </div>
                    <div className="form__social_register">
                        <p style={{ fontSize: "1.2rem" }}>------------------ ou ------------------</p>
                        <div className="social_register__buttons">
                            <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'none', border: 'none', padding: 0 }}>
                                <CustomGoogleButton
                                    onSuccess={async (tokenResponse) => {
                                        console.log("=== TOKEN RECEBIDO ===", tokenResponse);

                                        try {
                                            if (!tokenResponse.access_token) {
                                                throw new Error("Access token não veio");
                                            }
                                            console.log("Chamando signInWithGoogleAccessToken...");
                                            const user = await signInWithGoogleAccessToken(tokenResponse.access_token);
                                            console.log("Usuário logado com sucesso:", user);
                                            showMessage("Login com Google realizado com sucesso!");
                                            navigate("/"); // Redireciona para a página inicial após o login bem-sucedido
                                        } catch (error: any) {
                                            console.error("=== ERRO NO LOGIN COM GOOGLE ===", error);
                                            console.error("Código do erro:", error.code);
                                            console.error("Mensagem:", error.message);
                                            showMessage("Erro ao entrar com Google: " + (error.message || "Erro desconhecido"));
                                        }
                                    }}
                                    onError={() => {
                                        showMessage("Falha na autenticação com Google");
                                    }}
                                />
                            </div>
                            <button type="button" className="social_button">
                                <img src={facebook} alt="Botão do facebook" />
                            </button>
                            <button type="button" className="social_button">
                                <img src={instagram} alt="Botão do instagram" />
                            </button>
                        </div>
                    </div>
                    <div className="form__login-section">
                        <Link to="/login">
                            <p style={{color: "#918a8a", textDecoration: "none", marginBottom: "10px"}} >Você tem uma conta?</p>
                            <button type="button" className="login__btn">Fazer login</button>
                        </Link>
                    </div>
                </form>
            </section>
        </>
    );
}

export default forgetPassword_page;
