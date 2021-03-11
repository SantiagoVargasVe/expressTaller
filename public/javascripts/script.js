const ws = new WebSocket("ws://localhost:3000")
ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data))
}

const renderMessages = (data) => {
  let display = ''
  data.forEach(element => {
    let actual = JSON.parse(element)
    display += `<p> ${actual.author}:${actual.message}</p>` 
  });
  document.getElementById("messages").innerHTML= display
}

const handleSubmit = (evt) => {
  evt.preventDefault()
  const message = document.getElementById("message")
  const author = document.getElementById("author")
  let tuple = {
    message:message.value,
    author :author.value,
    ts: Date.now()
  }
  let sendData = JSON.stringify(tuple)
  ws.send(sendData)
  sendData= "" 
  message.value = ""
  author.value= ""
}

const form = document.getElementById("form")
form.addEventListener("submit", handleSubmit)