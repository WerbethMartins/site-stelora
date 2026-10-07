import { useState } from "react";
import { type Order, toggleOrderWhatsapp } from "../types/Order";
import truck3 from "../assets/img/green-truck.png";


const STORE_WHATSAPP_NUMBER = "5547991846224";

interface Props {
    order: Order;
}

function OrderWhatsappToggle({ order }: Props) {
    const [isWhatsappActive, setIsWhatsappActive] = useState<boolean>(order.whatsappOptIn ?? false);
    const [loading, setLoading] = useState(false);

    const handleToggleWhatsapp = async () => {
        try{
            setLoading(true);
            const nextState = !isWhatsappActive;

            if(order.id) {
                await toggleOrderWhatsapp(order.id, nextState, order.whatsappNumber ?? "");
            }

            setIsWhatsappActive(nextState);

            if (nextState) {
                const message = encodeURIComponent(
                    `Olá! Gostaria de receber as atualizações do meu pedido #${order.id} por aqui.`
                );
                window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${message}`, "_blank");
            }
        }catch (error){
            console.error("Erro ao atualizar a preferência do WhatsApp:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`see-order__accept-notification ${isWhatsappActive ? "active" : ""}`}
            onClick={handleToggleWhatsapp}
            style={{
                cursor: loading  ? "wait" : "pointer",
                opacity: loading  ? 0.7 : 1,
                border: isWhatsappActive ? "1px solid #25D366" : "1px solid transparent",
                backgroundColor: isWhatsappActive ? "rgba(37, 211, 102, 0.1)" : "transparent",
                transition: "all 0.3s ease",
            }}
        >
            <img className="accept-img" src={truck3} alt="Notificação" />
            <p>
                {isWhatsappActive
                    ? "✅ Notificações ativadas no WhatsApp!"
                    : "Receba informações do seu pedido pelo WhatsApp"}
            </p>
        </div>
    );
}

export default OrderWhatsappToggle;