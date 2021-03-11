
const clients = []
const messages = []
const jsonMessages= []
const WebSocket = require ('ws')
const fs = require('fs')
const Message = require('./models/message')

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server })

  wss.on("connection", (ws) => {
    
    clients.push(ws)
    sendMessages() 

    ws.on("message", (message) => {
      
      act = JSON.parse(message)

      // Solo dice guardar los mensajes, no tuve tiempo para sacar los mensajes de la BD  y enviarlos sorry 😢
      Message.create({
        message: act.message,
        author: act.author,
        ts: act.ts
      }).then((row)=>{
        console.log(row)
      })
      jsonMessages.push(act)
      messages.push(message)
      sendMessages()
    })
  })

  const sendMessages = () => {
    fs.writeFileSync('messages.json', JSON.stringify(jsonMessages))
    clients.forEach((client) => client.send(JSON.stringify(messages)))
  }
}

exports.wsConnection = wsConnection