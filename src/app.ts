import express, { Request, Response } from 'express';
const venom = require('venom-bot');
const axios = require('axios');
const fs = require('fs');

interface Message {
  to: string;
  message: string;
}

const app = express();
const port = process.env.PORT || 3000;
let clientVenom: any;

app.use(express.json());

 function sendMessage(to: string, message: string) {
   clientVenom
    .sendText(to + '@c.us', message)
    .then((result: any) => {
      console.log('Result: ', result); // return object success
    })
    .catch((erro: any) => {
      console.error('Error when sending: ', erro); // return object error
    });
}

app.post('/sendMessage',  (req: Request, res: Response) => {
  const messages: Message[] = req.body;

  for (const message of messages) {
      sendMessage(message.to, message.message);
  }
  
  res.json(true);
});

app.get('/getQrCode', (req: Request, res: Response) => {
  var base = "";
  venom
  .create(
    'henrique',
    (base64Qr: string, asciiQR: any, attempts: any, urlCode: any) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
           // Convertendo o QR code em base64
           const base64QR = base64Qr.split(',')[1]; // Obtendo apenas a parte base64

           // Use o base64QR como necessário, por exemplo, retornando-o como resposta de uma API
           base = base64Qr;
           res.json(base);

    },
    undefined,
    { 
      logQR: true,
      puppeteer: {
        launchOptions: {
          timeout: 60000, // Tempo limite em milissegundos (aumente conforme necessário)
        },}}
  )
  .then((client: any) => {
    clientVenom = client
    start(clientVenom)
    console.log("Conectado");
  })
  .catch((erro: any) => {
    console.log(erro);
  });
  
  
});

// function start(client: any) {
//   client.onMessage((message: any) => {
//     console.log(message)
//     if (message.body === 'Hi' && message.isGroupMsg === false) {
//       client
//         .sendText(message.from, 'Welcome Venom 🕷')
//         .then((result: any) => {
//           console.log('Result: ', result); //return object success
//         })
//         .catch((erro: any) => {
//           console.error('Error when sending: ', erro); //return object error
//         });
//     }
//   });
// }

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Adicione esta variável para armazenar a URL do webhook
const webhookURL = 'https://hook.us1.make.com/tx9wn864bs5xms1ty1m156zi8p4cb9ql';

// Rota para receber mensagens do webhook
app.post('/webhook', (req: Request, res: Response) => {
  const { from, body } = req.body;

  // Faça o que desejar com a mensagem recebida do webhook
  console.log(`Received message from ${from}: ${body}`);

  res.json({ success: true });
});

// Restante do seu código...//////////////////////////////////////////////////////////////////

// function start(client: any) {
//   client.onMessage((message: any) => {
//     console.log(message);

//     // Adicione o código para notificar o webhook quando houver uma nova mensagem
//     notifyWebhook(message.from, message.body);

//     if (message.body === 'Hi' && message.isGroupMsg === false) {
//       client
//         .sendText(message.from, 'Welcome Venom 🕷')
//         .then((result: any) => {
//           console.log('Result: ', result);
//         })
//         .catch((erro: any) => {
//           console.error('Error when sending: ', erro);
//         });
//     }
//   });
// }

// // Função para notificar o webhook
// function notifyWebhook(from: string, body: string) {
//   // Aqui você fará uma solicitação HTTP para o seu webhook com os dados da mensagem
//   // Use a biblioteca axios ou outra de sua escolha para isso
//   // Certifique-se de incluir a URL do webhook na solicitação

//   // Exemplo usando axios:
//   axios.post(webhookURL, { from, body })
//     .then((response: { data: any; }) => console.log('Webhook notified:', response.data))
//     .catch((error: any) => console.error('Error notifying webhook:', error));
// }

function start(client: any) {
  client.onMessage((message: any) => {
    console.log(message);

    // Adicione o código para notificar o webhook quando houver uma nova mensagem
    notifyWebhook(message);

    if (message.body === 'Hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result: any) => {
          console.log('Result: ', result);
        })
        .catch((erro: any) => {
          console.error('Error when sending: ', erro);
        });
    }
  });
}

// Função para notificar o webhook
function notifyWebhook(message: any) {
  // Agora, você tem acesso a todos os dados da mensagem no objeto 'message'
  // Faça o que desejar com os dados da mensagem, como enviá-los para o webhook

  // Exemplo usando axios:
  axios.post(webhookURL, message)
    .then((response: { data: any; }) => console.log('Webhook notified:', response.data))
    .catch((error: any) => console.error('Error notifying webhook:', error));
}

