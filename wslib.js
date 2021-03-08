
const clients = [];
const messages = [];
const webSocket = require ('ws')
const wsConnection = (server) => {
  const wss = WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      messages.push(message);
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};

exports.wsConnection = wsConnection;