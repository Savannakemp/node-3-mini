const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const mc = require('./messageCtrl')
require('dotenv').config()
let { SERVER_PORT, SESSION_SECRET } = process.env

const app = express()
app.use(bodyParser.json())

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use((req, res, next) => {
    let badWords = ['knucklehead', 'jerk', 'internet explorer'];
    if (req.body.message) {
        let badWordsExist = true;
        for (let i = 0; i < badWords.length; i++) {
            let regex = new RegExp(badWords[i], 'g');
            req.body.message = req.body.message.replace(regex, '****');
        }
        next();
    } else {
        next();
    }
});

app.get('/api/messages', mc.getAllMessages)
app.post('/api/messages', mc.createMessage)
app.get('/api/messages/history', mc.history)
app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
})