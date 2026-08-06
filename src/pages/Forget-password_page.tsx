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

function forgetPassword_page() {
    const { showMessage } = useMessage();

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

                <form className="forget-password__form">
                    <div className="form__header">
                        <h2>Insira seu endereço de e-mail</h2>
                    </div>
                    <div className="form__input">
                        <input name="email" type="text" placeholder="Email do Usuário" required />
                        <div>
                            <p>
                                <Link  style={{color: "#918a8a", textDecoration: "none"}} to="/register">Voltar a página de cadastro</Link>
                            </p>
                        </div>
                        <div className="form__button-section">
                            <button type="submit"  className="button-section__btn">Enviar</button>
                        </div>
                    </div>
                    <div className="form__social_register">
                        <p style={{ fontSize: "1.2rem" }}>------------------ ou ------------------</p>
                        <div className="social_register__buttons">
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
                    </div>
                    <div className="form__login-section">
                        <p style={{color: "#918a8a", textDecoration: "none"}} >Você tem uma conta?</p>
                        <button type="submit" className="login__btn">Fazer login</button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default forgetPassword_page;