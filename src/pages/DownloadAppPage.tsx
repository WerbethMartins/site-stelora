import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile";

// Images
import arrow from "../assets/img/arrow.png";
import download_logo from "../assets/img/Logo_download.png";
import accept from "../assets/img/accept.png";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Guarda o evento se ele disparar antes do React carregar
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function DownloadAppPage() {
  const isMobile = useIsMobile();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(globalDeferredPrompt);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showAndroidManualHelp, setShowAndroidManualHelp] = useState<boolean>(false);

  useEffect(() => {
    // Detecta iOS
    const userAgent = navigator.userAgent || navigator.vendor;
    const isIosDevice = /iPhone|iPad|iPod/i.test(userAgent);
    setIsIOS(isIosDevice);

    // Detecta se já está em modo PWA instalado
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Escuta o evento caso ele ocorra com o componente já montado
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      globalDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowAndroidManualHelp(true);
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    globalDeferredPrompt = null;
  };

  return (
    <section className="download-page">
      <header className="download-page__header">
        <Link to="/catalog" className="download-page__back-link">
          <button type="button" className="catalog__back-btn">
            <img src={arrow} alt="Voltar" />
          </button>
        </Link>
        <h1 className="catalog__title">Baixe o App</h1>
      </header>

      <div className="download-page__content">
        {!isMobile ? (
          /* DESKTOP */
          <div className="download-page__desktop-card">
            <img className="download-page__img" src={download_logo} alt="Icone de download" />
            <button type="button" className="download-page__btn">
              Acesse pelo Celular para Instalar
            </button>
          </div>
        ) : (
          /* MOBILE */
          <div className="download-page__mobile-card">
            {isInstalled ? (
              <div className="download-page__status">
                <img className="status__img" src={accept} alt="Icone de download concluido" />
                <h1>Aplicativo Já Instalado!</h1>
                <p>Você já pode acessar o app diretamente pela tela de início do seu celular.</p>
              </div>
            ) : isIOS ? (
              /* INSTRUÇÕES iOS */
              <div className="download-page__ios-instructions">
                <h2>Como instalar no iPhone (iOS):</h2>
                <ol className="instructions__list">
                  <li>
                    Toque no botão <strong>Compartilhar</strong> na barra do Safari (ícone <span className="icon-share">⎋</span>).
                  </li>
                  <li>
                    Selecione <strong>Adicionar à Tela de Início</strong> (ícone <span className="icon-plus">+</span>).
                  </li>
                  <li>Toque em <strong>Adicionar</strong> no canto superior.</li>
                </ol>
              </div>
            ) : (
              /* AÇÃO ANDROID */
              <div className="download-page__android-action">
                <img className="android-action__img" src={download_logo} alt="Icone de download" />
                <div className="android-action__main">
                  <h2 className="android-action__title">Instalação Rápida</h2>
                  <p>Tenha acesso rápido ao nosso catálogo diretamente da sua tela inicial.</p>
                </div>

                <button
                  type="button"
                  className="download-page__install-btn"
                  onClick={handleInstallClick}
                >
                  {deferredPrompt ? "Instalar Aplicativo Agora" : "Como Instalar Manualmente"}
                </button>

                {/* Exibe o passo a passo manual caso o prompt automático não esteja disponível */}
                {(!deferredPrompt || showAndroidManualHelp) && (
                  <div className="android-manual-instructions" style={{ marginTop: "1.5rem", textWrap: "pretty" }}>
                    <p style={{ fontSize: "0.9rem", color: "#666" }}>
                      Se o botão de instalação automática não abrir, siga os passos abaixo:
                    </p>
                    <ol className="instructions__list" style={{ marginTop: "0.5rem" }}>
                      <li>Toque no menu do navegador (<strong>3 pontinhos</strong> no canto superior direito).</li>
                      <li>Procure e toque em <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}