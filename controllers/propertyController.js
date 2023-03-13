const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { upload, uploadToS3 } = require('../utils/awsStorage')

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
            _parking,    //Boolean?
            _balcony,    //Int?
            _furnishing, //Furnish?
        } = req.body
        console.log("body", req.body)
        console.log("files", req.files)
        let sellerData = await prisma.Seller.findUniqueOrThrow(({
            where: {
                userId: parseInt(req.query.id)
            }
        }))
        let ObjUrls = []
        if (sellerData) {
            console.log("length", req.files.length)
            if (req.files && req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++) {
                    // console.log(req.files[i]);
                    let objUrl = await uploadToS3(req.files[i].buffer);
                    console.log(" Aws url", objUrl.Location);
                    ObjUrls.push(objUrl.Location);
                }
            }

            console.log("seller data", sellerData)
            console.log("url obj", ObjUrls)
            let property = await prisma.Property.create({
                data: {
                    sellerId: sellerData.id,
                    title: _title,
                    description: _description,
                    address: _address,
                    type: _type,
                    cost: parseInt(_cost),
                    deposit: parseInt(_deposit),
                    bedrooms: parseInt(_bedrooms),
                    washRooms: parseInt(_washRooms),
                    floorNum: parseInt(_floorNum),
                    balcony: parseInt(_balcony),
                    parking: _parking,
                    furnishing: _furnishing,
                    mediaUrls: ObjUrls
                }
            })



            if (property) {
                console.log("this is a db res");
                return res.status(200).send(property);

            } else {
                return res.status(500)
            }
        }
    } catch {
        console.error
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
            _parking,    //Boolean?
            _balcony,    //Int?
            _furnishing, //Furnish?
        } = req.body
        console.log("body", req.body)
        console.log("files", req.files)
        let sellerData = await prisma.Seller.findUniqueOrThrow(({
            where: {
                userId: parseInt(req.query.id)
            }
        }))
        let ObjUrls = []
        if (sellerData) {
            console.log("length", req.files.length)
            if (req.files && req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++) {
                    // console.log(req.files[i]);
                    let objUrl = await uploadToS3(req.files[i].buffer);
                    console.log(" Aws url", objUrl.Location);
                    ObjUrls.push(objUrl.Location);
                }
            }

            console.log("seller data", sellerData)
            console.log("url obj", ObjUrls)
            let property = await prisma.Property.update({
                where: {
                    id: parseInt(_propertyId),
                },
                data: {
                    title: _title,
                    description: _description,
                    address: _address,
                    type: _type,
                    cost: parseInt(_cost),
                    deposit: parseInt(_deposit),
                    bedrooms: parseInt(_bedrooms),
                    washRooms: parseInt(_washRooms),
                    floorNum: parseInt(_floorNum),
                    balcony: parseInt(_balcony),
                    parking: _parking,
                    furnishing: _furnishing,
                    mediaUrls: {
                        push: ObjUrls
                    }
                }
            })

            if (property) {
                console.log("this is a db res");
                return res.status(200).send(property);

            } else {
                return res.status(500)
            }
        }
    } catch {
        console.error
    }

}

exports.deleteProperty = async (req, res, next) => {
    try {
        let deleteDB = await prisma.Property.delete({
            where: { id: parseint(req.query.id) }
        })
        if (deleteDB) {
            console.log("this is a db res");
            return res.status(200).send(deleteDB);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
    }

}




