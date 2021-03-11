var express = require('express')
var router = express.Router()
const fs = require('fs')
const WebSocket = require("ws");
const Joi = require('joi');
const ws = new WebSocket("ws://localhost:3000");

router.get('/', function(req, res, next) {
    res.send(`<a href= 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'> xd <a>`)
  })

router.get('/messages', (req,res,next) =>{
    let jsonData = fs.readFileSync("./messages.json")
    let sendData = JSON.parse(jsondata)
    res.send(sendData)
})

router.get('/messages/:id', (req,res,next)=>{
    let jsonData = fs.readFileSync("./messages.json")
    let messages = JSON.parse(jsonData)
    let required = req.params.id
    let lookingFor 
    messages.forEach(element => {
        if(element.ts == required){
            lookingFor = element
        }
    });
    if(lookingFor){
        res.send(lookingFor)
    }else{
        res.send(404)
    }
})

router.post('/messages/', (req,res,next)=>{
    let body = req.body
    let jsonMessages = fs.readFileSync('./messages.json')
    let messages = JSON.parse(jsonMessages)
    let arrayMessages = []
    for ( let i in messages){
        console.log('entre')
        arrayMessages.push(messages[i])
    }
    ws.send(JSON.stringify(body))
    arrayMessages.push(body)
    console.log(arrayMessages)
    fs.writeFile('./messages.json',JSON.stringify(arrayMessages), (err)=>{
        if (err){
            console.log(err)
        }
    })
    if(check(body).error){
        res.sendStatus(400)
    }else{
        res.sendStatus(200)
    }
})


router.put('/messages/:id', (req,res,next)=>{
    let ts = req.params.id
    let body = req.body
    body['ts']=ts
    console.log(body)
    let jsonMessages = fs.readFileSync('./messages.json')
    let messages = JSON.parse(jsonMessages)
    let arrayMessages = []
    let lookingFor = false
    for ( let i in messages){
        if(messages[i].ts == body.ts){
            messages[i].message = body.message
            lookingFor= true
        }
        arrayMessages.push(messages[i])
    }
    console.log(arrayMessages)
    fs.writeFile('./messages.json',JSON.stringify(arrayMessages), (err)=>{
        if (err){
            console.log(err)
        }
    })
    if(check(body).error && !lookingFor){
        res.sendStatus(400)
    }else {
        res.sendStatus(200)
        
    }
})


router.delete('/messages/:id', (req,res,next)=>{
    let ts = req.params.id
    let jsonMessages = fs.readFileSync('./messages.json')
    let messages = JSON.parse(jsonMessages)
    let arrayMessages = []
    let lookingFor 
    for ( let i in messages){
        arrayMessages.push(messages[i])
        if(messages[i].ts == ts){
           lookingFor= arrayMessages.pop()
        }
        
    }
    console.log(arrayMessages)
    fs.writeFile('./messages.json',JSON.stringify(arrayMessages), (err)=>{
        if (err){
            console.log(err)
        }
    })
    if(lookingFor){
        res.send(200)
    }else{
        res.send(404)
    }
})

const check = (data) =>{
    const schema = Joi.object({
        author: Joi.string()
          .pattern(new RegExp("([A-zÀ-ú])\\s([A-zÀ-ú])"))
          .required(),
        message: Joi.string().required().min(5),
        ts: Joi.number(),
      }).options({ abortEarly: false })

    return schema.validate(data)
}

module.exports = router
