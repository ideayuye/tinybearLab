
const { Wechaty ,Contact,Room} = require('wechaty')
Wechaty.instance() // Singleton
.on('scan', (url, code) => console.log(`Scan QR Code to login: ${code}\n${url}`))
.on('login',       user => {
    console.log(`User ${user} logined`);
    Contact.findAll().then(data=>{
        // console.log(data);
    })
    Room.findAll().then(data=>{
        console.log(data);
    })
})
.on('message',  message => console.log(`Message: ${message}`,`message from ${message.from()}`))
.init()


