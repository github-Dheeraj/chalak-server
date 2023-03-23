
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const HTTPError = require("../utils/HTTPError.js");
const { HTTPResponse } = require("../utils/httpResponse.js");
const {
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
} = require("../config/config");
require('dotenv').config();


//Comment this will not be used until login flow with Email and Password is Done
exports.createSeller = async (req, res) => {
    console.log("createSeller")
    try {
        let { _email, _businessId, _tags } = req.body
        let userData = await prisma.User.findUnique({
            where: {
                email: _email
            }
        })
        console.log("user", userData)

        if (userData) {
            let seller = await prisma.Seller.create({
                data: {
                    userId: userData.id,
                    businessId: _businessId,
                    tags: _tags

                }
            })
            console.log("successfully seller", seller)
            if (seller) {
                console.log("seller created");
                return new HTTPResponse(res, true, 200, null, null, { seller });

            } else {
                return new HTTPError(res, 400, null, "internal server error")
            }
        } else {

            return new HTTPError(res, 404, null, "User not found")
        }

    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}


//comment discuss with Sidharth
exports.updateSeller = async (req, res) => {
    try {
        console.log('updateSeller')
        let { _businessId, _tags } = req.body

        let userData = await prisma.User.findUnique({
            where: {
                email: _email
            }
        })
        if (userData) {
            let sellerData = await prisma.Seller.findFirstOrThrow({
                where: {
                    userId: userData.id
                }
            })

            console.log("type of link", typeof (tempSocailLinkArray))
            let updateRes = await prisma.Seller.update({
                where: { id: sellerData.id },
                data: {
                    tags: _tags,    //@type String[]
                    businessId: _businessId //@type String
                }
            })
            console.log("update successful", updateRes)
            if (updateRes) {
                console.log("this is a db res");
                return new HTTPResponse(res, true, 200, null, null, { updateRes });

            } else {
                return new HTTPError(res, 400, null, "internal server error")
            }
        } else {
            return new HTTPError(res, 404, null, "User not found")
        }

    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }


}



//Get all the seller details
exports.checkSellerDetails = async (req, res) => {
    try {
        // ... you will write your Prisma Client queries here
        const userDetail = await prisma.User.findUnique({
            where: {
                email: req.body._email
            },
        })
        if (userDetail) {
            const sellerDetail = await prisma.Seller.findUnique({
                where: {
                    userId: userDetail.id
                }
            })


            if (sellerDetail) {
                console.log("this is a db res");
                return new HTTPResponse(res, true, 200, null, null, { sellerDetail });

            } else {
                return new HTTPError(res, 404, null, "seller not found")
            }
        } else {
            return new HTTPError(res, 404, null, "User not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }

}

exports.deleteSeller = async (req, res) => {
    console.log("delete users")

    try {
        const userDetail = await prisma.User.findUnique({
            where: {
                email: req.body._email
            },
        })
        if (userDetail) {
            const seller = await prisma.Seller.findUnique({
                where: {
                    userId: userDetail.id
                }
            })

            if (seller) {

                const sellerDelete = await prisma.Seller.delete({
                    where: {
                        userId: seller.id
                    }
                })
                if (sellerDelete) {
                    console.log("this is a db res");
                    return new HTTPResponse(res, true, 200, null, null, { sellerDelete });
                } else {
                    return res.status(404).send("Seller not found")
                }

            } else {
                return new HTTPError(res, 404, null, "Seller not found")
            }
        } else {
            return res.status(404).send("User not found")
        }

    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }

}

//get ALl messages to  user 
exports.getAllMessages = async (req, res, next) => {
    try {
        const userDetail = await prisma.User.findUnique({
            where: {
                email: req.body._email
            },
        })
        if (userDetail) {

            const getSeller = await prisma.Seller.findUnique({
                where: {
                    userId: userDetail.id
                }
            })
            if (getSeller) {
                console.log("this is a db res");
                return res.status(200).send({ data: getSeller.messagesRecieved });

            } else {
                return new HTTPError(res, 404, null, "seller not found")
            }
        } else {
            return new HTTPError(res, 404, null, "User not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}

exports.getActiveProperty = async (req, res, next) => {
    try {
        const userDetail = await prisma.User.findUnique({
            where: {
                googleId: req.body._googleId
            },
        })
        if (userDetail) {

            const getSeller = await prisma.Seller.findUnique({
                where: {
                    userId: userDetail.id
                }
            })
            if (getSeller) {

                const activeProperties = await prisma.Property.findUnique({
                    where: {
                        sellerId: getSeller.id,
                        isActive: true
                    }
                })

                console.log("Properties found");
                return new HTTPResponse(res, true, 200, null, null, { activeProperties })

            } else {
                return new HTTPError(res, 404, null, "seller not found")
            }
        } else {
            return new HTTPError(res, 404, null, "User not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}