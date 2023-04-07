const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { upload, uploadToS3 } = require('../utils/awsStorage')
const HTTPError = require("../utils/HTTPError");
const { HTTPResponse } = require("../utils/httpResponse");

exports.getInTouchAdmin = async (req, res, next) => {

    try {
        let {
            _name,
            _phone,
            _email,
            _message
        } = req.body
        console.log(req.body)
        let newMessage = await prisma.Connect.create({
            data: {
                name: _name,
                phone: _phone,
                email: _email,
                message: _message
            }

        })

        return new HTTPResponse(res, true, 200, null, null, { newMessage });

    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
};