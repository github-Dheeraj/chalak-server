const { Client, RemoteAuth, LocalAuth, NoAuth } = require("whatsapp-web.js");
var qrcode = require("qrcode-terminal");
const HTTPError = require("../utils/HTTPError.js");
const { HTTPResponse } = require("../utils/httpResponse.js");
const { WHATSAPP_AUTH } = require("../config/config")
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
    console.log('api key', req.header("whatsApp-key"))
    let api_key = req.header("whatsApp-key")
    if (api_key == WHATSAPP_AUTH) {


        console.log("signUp ready")

        client.on('qr', (qr) => {
            console.log('QR RECEIVED', qr);
            qrcode.generate(qr, { small: true });
            return new HTTPResponse(res, true, 200, null, null, { qrcode: qr })
        });

        client.on('ready', () => {
            console.log('Client is ready!');
            client.sendMessage("918412891141@c.us", "Hey Dheeraj, WhatsApp notification server is live, for chalak. Good Luck Building🚀");
        });

        client.on('message', message => {

            if (message.body.includes('Hi')) {
                message.reply('Hello');
            } else {
                message.reply('Kindly give correct input');
            }
        })
    } else {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}


exports.messageUser = async (_number, _message) => {
    // console.log(req.body)
    // let { _number, _message } = req.body
    client.sendMessage('91' + `${_number}` + "@c.us", _message).then((result) => {
        console.log("message sent", result)
        // res.send({ message: result })
    });
}

