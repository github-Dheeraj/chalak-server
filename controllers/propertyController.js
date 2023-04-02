const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { upload, uploadToS3 } = require('../utils/awsStorage')
const HTTPError = require("../utils/HTTPError");
const { HTTPResponse } = require("../utils/httpResponse");

exports.createProperty = async (req, res) => {
    try {
        let {
            _title,      //String
            _address,    //String?
            _rent,       //Int?
            _deposit,    //Int?
            _bedrooms,   //Int?
            _washRooms,  //Int?
            _floorNum,   //Int?
            _floorArea,
            _parking,    //Boolean?
            _balcony,    //Int?
            _furnish, //Furnish?
            _furnishings //String[]
        } = req.body
        console.log("body", req.body)
        if (_parking.toLowerCase() === "true") {
            _parking = true
        } else {
            _parking = false
        }

        let userData = await prisma.User.findUnique({
            where: {
                email: req.body._email
            }
        })

        if (userData) {
            let sellerData = await prisma.Seller.findUnique(({
                where: {
                    userId: userData.id
                }
            }))
            console.log("SellerData", sellerData)

            let ObjUrls = []
            if (sellerData) {
                if (req.files && req.files.length > 0) {
                    for (var i = 0; i < req.files.length; i++) {
                        // console.log(req.files[i]);
                        let objUrl = await uploadToS3(req.files[i].buffer, req.files[i].originalname);
                        console.log(" Aws url", objUrl.Location);
                        ObjUrls.push(objUrl.Location);
                    }
                }
                console.log("seller Id", sellerData.id)
                let property = await prisma.Property.create({
                    data: {
                        sellerId: parseInt(sellerData.id),
                        title: _title,
                        address: _address,
                        rent: parseInt(_rent),
                        deposit: parseInt(_deposit),
                        bedrooms: parseInt(_bedrooms),
                        washRooms: parseInt(_washRooms),
                        floorNum: parseInt(_floorNum),
                        floorArea: parseInt(_floorArea),
                        balcony: parseInt(_balcony),
                        parking: Boolean(_parking),
                        furnish: _furnish,
                        furnishings: _furnishings,
                        mediaUrls: ObjUrls
                    }
                })
                if (property) {
                    console.log("Property created");
                    return new HTTPResponse(res, true, 200, null, null, { property });

                } else {

                    return new HTTPError(res, 400, null, "internal server error")
                }
            } else {
                return new HTTPError(res, 404, null, "Seller not initialized")
            }
        } else {
            return new HTTPError(res, 404, null, "User not found")
        }

    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }

}

exports.updateProperty = async (req, res, next) => {
    try {

        let {
            _propertyId,
            _title,      //String
            _address,    //String?
            _rent,       //Int?
            _deposit,    //Int?
            _bedrooms,   //Int?
            _washRooms,  //Int?
            _floorNum,   //Int?
            _floorArea,
            _parking,    //Boolean?
            _balcony,    //Int?
            _furnish, //Furnish?
            _furnishings, //String[]
            _isActive
        } = req.body
        console.log("files", req.body)
        if (_parking) {
            if (_parking.toLowerCase() === "true") { _parking = true } else {
                _parking = false
            }
            if (_isActive.toLowerCase() === "true") { _isActive = true } else {
                _parking = false
            }
        }

        let sellerData = await prisma.Property.findUnique(({
            where: {
                id: parseInt(_propertyId)
            }
        }))
        console.log("sellerData", sellerData)
        let ObjUrls = []
        if (sellerData) {
            if (req.files && req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++) {
                    // console.log(req.files[i]);
                    let objUrl = await uploadToS3(req.files[i].buffer, req.files[i].originalname);
                    console.log(" Aws url", objUrl.Location);
                    ObjUrls.push(objUrl.Location);
                }
            }

            console.log("seller data", sellerData)
            let property = await prisma.Property.update({
                where: {
                    id: parseInt(_propertyId),
                },
                data: {
                    title: _title,
                    address: _address,
                    rent: parseInt(_rent),
                    deposit: parseInt(_deposit),
                    bedrooms: parseInt(_bedrooms),
                    washRooms: parseInt(_washRooms),
                    floorNum: parseInt(_floorNum),
                    floorArea: parseInt(_floorArea),
                    balcony: parseInt(_balcony),
                    parking: _parking,
                    furnish: _furnish,
                    furnishings: _furnishings,
                    mediaUrls: {
                        push: ObjUrls
                    },
                    isActive: _isActive
                }
            })

            if (property) {
                console.log("Property updated");
                return new HTTPResponse(res, true, 200, null, null, { property });

            } else {
                return new HTTPError(res, 400, null, "internal server error")
            }
        } else {
            return new HTTPError(res, 400, null, "Seller not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }

}

exports.updatePropertyStatus = async (req, res) => {
    try {

        let {
            _propertyId,
            _isActive
        } = req.body
        console.log("files", req.body)


        let sellerData = await prisma.Property.findUnique(({
            where: {
                id: parseInt(_propertyId)
            }
        }))
        console.log("sellerData", sellerData)
        if (sellerData) {

            console.log("seller data", sellerData)
            let property = await prisma.Property.update({
                where: {
                    id: parseInt(_propertyId),
                },
                data: {
                    isActive: _isActive

                }
            })

            if (property) {
                console.log("Property updated");
                return new HTTPResponse(res, true, 200, null, null, { property });

            } else {
                return new HTTPError(res, 400, null, "Property not found")
            }
        } else {
            return new HTTPError(res, 400, null, "Seller not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }

}
exports.getPropertyDetails = async (req, res, next) => {
    try {
        let property = await prisma.Property.findUnique({
            where: { id: parseInt(req.query.id) }
        })
        if (property) {
            console.log("property found");
            return new HTTPResponse(res, true, 200, null, null, { property });

        } else {
            return new HTTPError(res, 400, null, "Property not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}

exports.deleteProperty = async (req, res, next) => {
    try {
        let deleteDB = await prisma.Property.delete({
            where: { id: parseInt(req.query._propertyId) }
        })
        if (deleteDB) {
            console.log("Property deleted");
            return new HTTPResponse(res, true, 200, null, null, { deleteDB });

        } else {
            return new HTTPError(res, 400, null, "Property not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }

}


// _email query param
exports.getPropertyListUser = async (req, res, next) => {
    try {
        let userExist = await prisma.User.findUnique({
            where: {
                email: req.query._email
            },
        })
        if (userExist) {
            console.log("USer found");

            let sellerExist = await prisma.Seller.findUnique({
                where: {
                    userId: userExist.id
                },
            })
            console.log("Seller found", sellerExist)
            if (sellerExist) {
                let allProperty = await prisma.Property.findMany({
                    where: {
                        sellerId: sellerExist.id
                    }
                })

                return new HTTPResponse(res, true, 200, null, null, { allProperty });

            }

        } else {
            return new HTTPError(res, 400, null, "Property not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}



exports.sendMessageToSeller = async (req, res) => {
    try {
        console.log("req body", req.body)
        let {
            _propertyId,
            _name,
            _phone,
            _email,
            _message } = req.body

        let checkIfExist = await prisma.Property.findUnique({
            where: {
                id: _propertyId
            }
        })
        if (checkIfExist) {

            let newMessage = await prisma.Message.create({
                data: {
                    propertyId: _propertyId,
                    name: _name,
                    phone: _phone,
                    email: _email,
                    sellerId: checkIfExist.sellerId
                }
            })

            await prisma.Property.update({
                where: {
                    id: _propertyId
                },
                data: {
                    messagesRecieved: { increment: 1 }
                }
            })

            //send whatsApp message to user
            // messageUser(_phone, _message)  
            return new HTTPResponse(res, true, 200, null, null, { newMessage })

        } else {
            return new HTTPError(res, 404, null, "Property not found")
        }

    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}

exports.getIntrestedMessages = async (req, res, next) => {
    try {
        console.log("req body", req.query)

        let checkIfExist = await prisma.Property.findUnique({
            where: {
                id: parseInt(req.query._propertyId)
            }
        })
        console.log("check if exixst", checkIfExist)
        if (checkIfExist) {

            let allMessages = await prisma.Message.findMany({
                where: {
                    propertyId: parseInt(req.query._propertyId)
                }
            })
            //send whatsApp message to user
            // messageUser(_phone, _message)  
            return new HTTPResponse(res, true, 200, null, null, allMessages)

        } else {
            return new HTTPError(res, 404, null, "Property not found")
        }

    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}



