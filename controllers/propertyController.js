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
            _cost,       //Int?
            _deposit,    //Int?
            _bedrooms,   //Int?
            _washRooms,  //Int?
            _floorNum,   //Int?
            _floorArea,
            _parking,    //Boolean?
            _balcony,    //Int?
            _furnishing, //Furnish?
        } = req.body
        console.log("user Id", req.query.id)
        let sellerData = await prisma.Seller.findUnique(({
            where: {
                userId: parseInt(req.query.id)
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
                    cost: parseInt(_cost),
                    deposit: parseInt(_deposit),
                    bedrooms: parseInt(_bedrooms),
                    washRooms: parseInt(_washRooms),
                    floorNum: parseInt(_floorNum),
                    floorArea: parseInt(_floorArea),
                    balcony: parseInt(_balcony),
                    parking: _parking,
                    furnishing: _furnishing,
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
            _cost,       //Int?
            _deposit,    //Int?
            _bedrooms,   //Int?
            _washRooms,  //Int?
            _floorNum,   //Int?
            _floorArea,
            _parking,    //Boolean?
            _balcony,    //Int?
            _furnishing, //Furnish?
        } = req.body
        console.log("files", req.files)
        let sellerData = await prisma.Seller.findUniqueOrThrow(({
            where: {
                userId: parseInt(req.query.id)
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
                    cost: parseInt(_cost),
                    deposit: parseInt(_deposit),
                    bedrooms: parseInt(_bedrooms),
                    washRooms: parseInt(_washRooms),
                    floorNum: parseInt(_floorNum),
                    floorArea: parseInt(_floorArea),
                    balcony: parseInt(_balcony),
                    parking: _parking,
                    furnishing: _furnishing,
                    mediaUrls: {
                        push: ObjUrls
                    }
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

exports.getPropertyDetails = async (req, res, next) => {
    try {
        let property = await prisma.Property.findUnique({
            where: { id: parseint(req.query.id) }
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
            where: { id: parseint(req.query.id) }
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




