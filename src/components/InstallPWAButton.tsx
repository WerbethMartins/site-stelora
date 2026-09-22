import React, { useEffect, useState } from "react";

// Definição da interface do evento nativo beforeinstallprompt para TypeScript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Detecta se o aplicativo já está rodando como um PWA instalado
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Ouve o evento do navegador quando o app cumpre os requisitos de PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Impede o banner padrão automático do Chrome
      setDeferredPrompt(e as BeforeInstallPromptEvent); // Salva o evento
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Esconde o botão caso o usuário instale o app
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log("PWA instalado com sucesso!");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Dispara o modal nativo do navegador para instalar
    await deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("Usuário aceitou a instalação do ícone/atalho.");
    } else {
      console.log("Usuário recusou a instalação.");
    }

    setDeferredPrompt(null);
  };

  // Se já estiver instalado ou se o navegador não liberou o prompt, não mostra nada
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <button
      type="button"
      className="install-pwa-btn"
      onClick={handleInstallClick}
      aria-label="Instalar atalho do aplicativo"
    >
      📲 Instalar App na Tela Inicial
    </button>
  );
};