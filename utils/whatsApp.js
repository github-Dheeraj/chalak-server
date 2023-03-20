const { Client, RemoteAuth, LocalAuth, NoAuth } = require("whatsapp-web.js");
var qrcode = require("qrcode-terminal");
const getResponse = require("./chatGPT")
const client = new Client({
    authStrategy: new NoAuth(),
    puppeteer: { headless: true },
    useChrome: false,
    qrTimeoutMs: 0,
    authTimeoutMs: 0,

});

exports.signUp = async (req, res) => {
    client.initialize()

    console.log("signUp ready")

    res.send("Yooo, whatsapp ready")
    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrcode.generate(qr, { small: true });
        res.send(qr)
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        // client.sendMessage("91@c.us", "Hello");
        // res.send("client is ready")
    });

    client.on('message', message => {

        if (message.body.includes('Hi')) {
            message.reply('Hello');
        } else {
            message.reply('Kindly give correct input');
        }
    })
}


exports.messageUser = async (_number, _message) => {
    // console.log(req.body)
    // let { _number, _message } = req.body
    client.sendMessage('91' + `${_number}` + "@c.us", _message).then((result) => {
        console.log("message sent", result)
        // res.send({ message: result })
    });
}

