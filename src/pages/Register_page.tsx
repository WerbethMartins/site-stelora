import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogleAccessToken, signUp } from "../service/AuthService";

// Components
import { NotificationPopover } from "../components/NotificationPopover";

//Context
import { useNotifications } from "../context/NotificationContext";

// Autenticação com o google
import CustomGoogleButton from "../components/CustomGoogleButton";  

// Images
import bell from "../assets/img/bell.png";
import arrow from "../assets/img/arrow.png";
import facebook from "../assets/img/facebook.png";
import instagram from "../assets/img/instagram_Color.png";

// Hooks
import { useMessage } from "../hooks/useMessage";

function Register_page(){
    const navegate = useNavigate();
    const { unreadCount } = useNotifications();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const { showMessage } = useMessage();
    const [isLoading] = useState(false);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent){
            if(popoverRef.current && !popoverRef.current.contains(event.target as Node)){
                setIsPopoverOpen(false);
            }
        }

        if (isPopoverOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPopoverOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await signUp(name, email, password);
            showMessage("Usuário criado com sucesso")
            navegate("/");
        }catch(error: any){
            if(error.code === 'auth/email-already-in-use') {
                showMessage("Esse email já está em uso")
                return;
            }else if(error.code === 'auth/weak-password'){
                showMessage("A senha deve ter pelo menos 6 caracteres.");
            } else {
                showMessage("Algo deu errado.");
            }
        }
        
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
                    <div className="form-header__title-group">
                        <h1 className="form__title">Registro</h1>
                    </div>
                    {/* Botão de Notificação com Badge */}
                    <div style={{ position: "relative" }}>
                        <button
                            type="button"
                            className="catalog__icon-btn"
                            onClick={() => setIsPopoverOpen((prev) => !prev)}
                            aria-label="Abrir Notificações"
                        >
                            <img className="catalog__icon" src={bell} alt="Notificações" />

                            {/* Badge de notificações não lidas */}
                            {unreadCount > 0 && (
                            <span className="catalog__notification-badge">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                            )}
                        </button>

                        {/* Painel Dropdown */}
                        {isPopoverOpen && (
                            <NotificationPopover onClose={() => setIsPopoverOpen(false)} />
                        )}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="register-form__header">
                        <h1>Crie sua conta</h1>
                    </div>
                    <div className="register-form__social-register">
                        {/* Link para direcionar o usuário se inscrever com sua conta do google */}
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
                                        navegate("/"); // Redireciona para a página inicial após o login bem-sucedido
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
                    <div className="register-form__input">
                        <input name="name" type="text" placeholder="Nome do Usuário" required />
                        <input name="email" type="email" placeholder="Email do Usuário" required />
                        <input name="password" type="password" placeholder="Senha do Usuário" required />
                    </div>
                    <div className="register-form__button-section">
                        <button type="submit"  className="button-section__btn">
                            {isLoading ? "Registrando" : "Registrar " }
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Register_page;
