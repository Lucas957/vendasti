// sendMsgWpp.js
import { startSession } from "./initWpp.js";

export async function sendMsgWpp(number, message) {
  try {
    // Aguarda a conexão e o cliente pronto
    const client = await startSession();

    // Envia a mensagem (o cliente já está pronto aqui)
    const msg = await client.sendMessage(`${number}@c.us`, message);
    console.log('✅ Mensagem enviada:', msg.id.id);

  } catch (error) {
    console.log("Erro ao enviar mensagem:", error);
  }
}