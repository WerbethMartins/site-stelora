import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../configuracao/FirebaseConfig";
import { createPixForOrder, type PixData } from "../service/PaymentService";

interface Props {
  orderId: string;
  total: number;
  onPaid: () => void; 
}

export function PixPaymentComponent({ orderId, total, onPaid }: Props) {
  const [pixInfo, setPixInfo] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quando o webhook confirmar, o status deixa de ser PENDING_PAYMENT
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (snap.exists() && snap.data().status !== "PENDING_PAYMENT") {
        onPaid();
      }
    });
    return () => unsubscribe();
  }, [orderId, onPaid]);

  const handleGeneratePix = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPixInfo(await createPixForOrder(orderId));
    } catch (err) {
      console.error("Erro ao gerar Pix:", err);
      setError("Não foi possível gerar o Pix. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!pixInfo?.qrCode) return;
    await navigator.clipboard.writeText(pixInfo.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {!pixInfo ? (
        <button type="button" onClick={handleGeneratePix} disabled={isLoading}>
          {isLoading ? "Gerando Pix..." : `Pagar R$ ${total.toFixed(2)} com Pix`}
        </button>
      ) : (
        <div>
          <h3>Escaneie o QR Code abaixo:</h3>
          <img
            src={`data:image/png;base64,${pixInfo.qrCodeBase64}`}
            alt="QR Code Pix"
            style={{ width: "200px", height: "200px" }}
          />
          <div style={{ marginTop: "15px" }}>
            <button type="button" onClick={handleCopyCode}>
              {copied ? "Copiado!" : "Copiar Código Pix (Copia e Cola)"}
            </button>
          </div>
          <p style={{ marginTop: "15px" }}>Aguardando a confirmação do pagamento...</p>
        </div>
      )}
      {error && <p style={{ color: "#eb2821" }}>{error}</p>}
    </div>
  );
}