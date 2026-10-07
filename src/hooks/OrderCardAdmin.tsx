import { OrderService } from "../service/OrderService";

import { useMessage } from "./useMessage";

function OrderCardAdmin({ order, onStatusUpdated }: { order: any; onStatusUpdated: () => void }) {
    const orderService = OrderService;
    const { showMessage } = useMessage();

    const handleStatusChange = async (newStatus: "IN_TRANSIT" | "FINISHED" | "CANCELED") => {
        try {
          await orderService.updateOrderStatus(order.id, newStatus);
          showMessage("Status atualizado com sucesso!");
          onStatusUpdated(); // Recarrega a lista de pedidos no estado do React
        } catch (error) {
          alert("Erro ao atualizar status.");
        }
    };

  return (
    <div className="order-card">
      {/* Botões para trocar o status */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {order.status === "IN_PROCESS" && (
          <button className="order-card__btn-transit" onClick={() => handleStatusChange("IN_TRANSIT")}>
            🚚 Marcar como Em Transporte
          </button>
        )}

        {order.status === "IN_TRANSIT" && (
          <button className="order-card__btn-finish" onClick={() => handleStatusChange("FINISHED")}>
            ✅ Concluir Entrega
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCardAdmin;