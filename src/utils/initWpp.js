// initWpp.js
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

let clientwpp = null;

export async function startSession() {
  if (clientwpp) return clientwpp; // Reutiliza se já estiver conectado

  try {
    clientwpp = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    // Retorna uma promise que resolve quando o cliente está pronto
    return new Promise((resolve, reject) => {
      clientwpp.on('qr', qr => {
        qrcode.generate(qr, { small: true });
      });

      clientwpp.on('ready', () => {
        console.log('✅ Cliente conectado!');
        resolve(clientwpp); // Resolve a promise com o cliente pronto
      });

      clientwpp.on('auth_failure', error => {
        reject(new Error('Falha na autenticação: ' + error));
      });

      clientwpp.initialize().catch(reject);
    });

  } catch (error) {
    console.log("Erro ao iniciar cliente:", error);
    throw error;
  }
}