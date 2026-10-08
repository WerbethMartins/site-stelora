import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { MercadoPagoConfig, Payment } from "mercadopago";

initializeApp();
const db = getFirestore();
const MP_ACCESS_TOKEN = defineSecret("APP_USR-4714777589702610-100721-142d988e55bced21d2821e9be219edc6-3748833760");

// Só é chamado dentro das functions, quando o secret já está disponível
const getPaymentClient = () =>
  new Payment(new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN.value() }));

// Chamada pelo front para gerar o Pix de um pedido
export const createPixPayment = onCall(
  { secrets: [MP_ACCESS_TOKEN] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Faça login para pagar.");
    }

    const orderId = request.data?.orderId as string | undefined;
    if (!orderId) {
      throw new HttpsError("invalid-argument", "orderId é obrigatório.");
    }

    const orderRef = db.collection("orders").doc(orderId);
    const snap = await orderRef.get();
    if (!snap.exists) throw new HttpsError("not-found", "Pedido não encontrado.");

    const order = snap.data()!;
    if (order.userId !== request.auth.uid) {
      throw new HttpsError("permission-denied", "Este pedido não é seu.");
    }
    if (order.status !== "PENDING_PAYMENT") {
      throw new HttpsError("failed-precondition", "Este pedido não está aguardando pagamento.");
    }

    const result = await getPaymentClient().create({
      body: {
        transaction_amount: Number(Number(order.total).toFixed(2)),
        description: `Pedido #${orderId}`,
        payment_method_id: "pix",
        external_reference: orderId,
        // Cole aqui a URL da function mercadoPagoWebhook (o deploy imprime no terminal)
        notification_url: "COLE_AQUI_A_URL_DO_WEBHOOK",
        payer: {
          email: request.auth.token.email ?? "",
          first_name: order.address?.recipientName ?? "Cliente",
        },
      },
      // Evita cobrança duplicada se o usuário clicar duas vezes
      requestOptions: { idempotencyKey: `pix-${orderId}` },
    });

    await orderRef.update({ paymentId: String(result.id) });

    const qr = result.point_of_interaction?.transaction_data;
    return {
      paymentId: result.id,
      qrCode: qr?.qr_code ?? "",
      qrCodeBase64: qr?.qr_code_base64 ?? "",
    };
  }
);

// Chamada pelo Mercado Pago quando o pagamento muda de status
export const mercadoPagoWebhook = onRequest(
  { secrets: [MP_ACCESS_TOKEN] },
  async (req, res) => {
    try {
      const type = req.body?.type ?? req.query.type;
      const paymentId = req.body?.data?.id ?? req.query["data.id"];

      if (type !== "payment" || !paymentId) {
        res.sendStatus(200);
        return;
      }

      // A notificação traz só o ID: consultamos o pagamento direto na API
      const payment = await getPaymentClient().get({ id: String(paymentId) });
      const orderId = payment.external_reference;

      if (payment.status === "approved" && orderId) {
        const orderRef = db.collection("orders").doc(orderId);
        const order = (await orderRef.get()).data();

        // Confere status (idempotência) e valor antes de liberar o pedido
        if (
          order &&
          order.status === "PENDING_PAYMENT" &&
          Number(payment.transaction_amount) === Number(Number(order.total).toFixed(2))
        ) {
          await orderRef.update({
            status: "IN_PROCESS",
            statusLabel: "Em Processo",
            paymentId: String(payment.id),
            paidAt: FieldValue.serverTimestamp(),
          });
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Erro no webhook do Mercado Pago:", error);
      res.sendStatus(500);
    }
  }
);