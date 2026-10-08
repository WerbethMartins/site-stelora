import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../configuracao/FirebaseConfig";

const functions = getFunctions(app);

export interface PixData {
  paymentId: number;
  qrCode: string;
  qrCodeBase64: string;
}

export async function createPixForOrder(orderId: string): Promise<PixData> {
  const callable = httpsCallable<{ orderId: string }, PixData>(functions, "createPixPayment");
  const { data } = await callable({ orderId });
  return data;
}