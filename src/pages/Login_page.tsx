import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogleAccessToken } from "../service/AuthService";

// Components
import CustomGoogleButton from "../components/CustomGoogleButton";

// Firebase
import { signIn } from "../service/AuthService";

// Hooks
import { useMessage } from "../hooks/useMessage";

// Images
import facebook from "../assets/img/facebook.png";
import instagram from "../assets/img/instagram_Color.png";

function Login_page(){
    const { showMessage, showError } = useMessage();
    const navigate = useNavigate();
    const [ isLoading, setIsLoading ] = useState(false); 

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { 
        e.preventDefault();

        // FormData captura automaticamente todos os inputs que têm o atributo "name"
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Validação Básica
        if(!email || !password){
            showMessage("Por favor, preencha todos os campos.");
            return;
        }

        try{
            setIsLoading(true); // Trava o botão enquanto carrega o site
            await signIn(email, password);
            showMessage("Usuário logado com sucesso!");
            // Redireciona o usuário para o Home (ou dashboard) após o login
            navigate("/");

        }catch(error: any){
            console.log("Erro no login:", error);

            // Tratamento de erros comuns do Firebase 
            if(error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' ){
                showError("E-mail ou Senha incorretos.");
            }else {
                showError("Ocorreu um erro ao fazer login. Tente novamente.");
            }    
        }finally{
            setIsLoading(false); // Para liberar o botão independente de suceso ou erro
        }   
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
                            <input 
                                name="email" 
                                type="email" 
                                id="email" 
                                placeholder="Digite seu e-mail" 
                            />
                        </div>
                        <div className="input-group">
                            <input name="password" type="password" id="password" placeholder="Digite sua senha" />
                        </div>
                        <div className="input-group">
                            <Link to="/forget-password">Esqueceu a senha?</Link>
                            {/* O texto do botão muda, caso esteja carregando */}
                            <button type="submit" className="input-group__btn" disabled={isLoading}>
                            {isLoading ? "Entrando..." : "Entrar"}
                            </button>
                        </div>
                    </div>
                    <div className="form_footer">
                        <p style={{ fontSize: "1.2rem" }}>------------------ ou ------------------</p>
                        <div className="social_login">
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
