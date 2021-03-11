
const clients = []
const messages = []
const jsonMessages= []
const WebSocket = require ('ws')
const fs = require('fs')


const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server })

  wss.on("connection", (ws) => {
    
    clients.push(ws)
    sendMessages() 

    ws.on("message", (message) => {
      act = JSON.parse(message)
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