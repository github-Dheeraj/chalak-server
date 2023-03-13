const { PrismaClient } = require('@prisma/client')
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const HTTPError = require("../utils/httpError");
const { HTTPResponse } = require("../utils/HTTPResponse");
const {
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
} = require("../config/config");
const prisma = new PrismaClient()

const { upload, uploadToS3 } = require("../utils/awsStorage")


//Implementation of login with google credentials

exports.createUser = async (req, res) => {
    console.log("req body ", req.body)
    try {

        let userExist = await prisma.User.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (!userExist) {
            let _picture;
            let { _name, _email, _googleId } = req.body
            if (req.file) {
                let obj = await uploadToS3(req.file.buffer);
                _picture = obj.Location
            }
            let user = await prisma.User.create({
                data: {
                    name: _name,
                    email: _email,
                    picture: _picture,
                    googleId: _googleId
                }
            })
            console.log("user created, ", user)
            if (user) {
                console.log("this is a db res");
                return res.status(200).send("User Created", user);

            } else {
                return res.status(500).send("Please input correct fields")
            }
        } else {
            return res.status(409).send("User Already exists")
        }

    } catch (err) {
        console.error
    }

}


// //Add it in loginViaGoogle function
// const initialiseSellerWithGoogle = async (googleObj) => {
//     try {
//         let { name, email, googleId, photoUrl } = googleObj

//         let seller = await prisma.User.create({
//             data: {
//                 name: name,
//                 email: email,

//                 googleId: googleId,
//                 photoUrl: photoUrl,

//             }
//         })
//         if (seller) {
//             console.log("this is a db res");
//             return res.status(200).send(seller);

//         } else {
//             return res.status(500)
//         }
//     } catch {
//         console.error
//     }

// }

exports.loginUser = async (req, res) => {
    try {
        let userExist = await prisma.User.findUnique({
            where: {
                email: req.body.email
            }
        })
        if (userExist) {
            res.status(200).send(userExist)
        } else {
            res.status(404).send("email does not exist")
        }
    } catch {
        console.error
    }
}

//Comment add parameters to update user profile
exports.updateUser = async (req, res) => {

    try {
        let {
            _name,
            _phone,
            _photoUrl,
            _socialLinks,
        } = req.body
        console.log("body", req.body)
        let userData = await prisma.User.findUnique({
            where: { id: parseInt(req.query.id) }
        })
        console.log("userData", userData)
        console.log("socialLinks", _socialLinks.length)

        if (_socialLinks.length > 0) {
            for (let i = 0; i < _socialLinks.length; i++) {
                await prisma.SocialLink.create({
                    data: {
                        name: _socialLinks[i]._name,
                        url: _socialLinks[i]._url,
                        userId: parseInt(req.query.id)
                    }
                })
            }
        }

        let updateRes = await prisma.User.update({
            where: { id: parseInt(req.query.id) },
            data: {
                name: _name,
                phone: _phone,
                photoUrl: _photoUrl

            }
        })
        if (updateRes) {
            console.log("this is a db res");
            return res.status(200).send(updateRes);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
    }


}

exports.checkUserDetails = async (req, res) => {
    try {
        // ... you will write your Prisma Client queries here
        const userDetail = await prisma.User.findUnique({
            where: {
                id: parseInt(req.query.id)
            }
        })

        if (userDetail) {
            console.log("this is a db res");
            return res.status(200).send(userDetail);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
    }
}

exports.deleteuser = async (req, res) => {
    try {
        const deleteUsers = await prisma.User.delete({
            where: {
                id: parseInt(req.query.id)
            },
        })
        if (deleteUsers) {
            console.log("this is a db res");
            return res.status(200).send(deleteUsers);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
    }

}

//check if user has listed the property  before adding it to bookmark
exports.userBookmarkProperty = async (req, res) => {
    try {
        let { _propertyId } = req.body
        let propertyData = await prisma.Property.findFirstOrThrow({
            where: { id: _propertyId }
        })
        if (propertyData) {
            let interest = await prisma.IntrestedProperties.create({
                data: {
                    userId: parseInt(req.query.id),
                    propertyId: _propertyId
                }

            })

            if (interest) {
                console.log("this is a db res");
                return res.status(200).send(interest);

            } else {
                return res.status(500)
            }
        }


    } catch {
        console.error
    }
}

exports.userUnBookmarkProperty = async (req, res) => {
    try {
        let { _propertyId } = req.body
        let propertyData = await prisma.IntrestedProperties.findFirstOrThrow({
            where: {
                userId: parseInt(req.query.id),
                propertyId: _propertyId
            }
        })
        if (propertyData) {
            let unInterest = await prisma.IntrestedProperties.delete({
                where: {
                    userId: parseInt(req.query.id),
                    propertyId: _propertyId
                }

            })

            if (unInterest) {
                console.log("this is a db res");
                return res.status(200).send(unInterest);

            } else {
                return res.status(500)
            }
        }


    } catch {
        console.error
    }
}



exports.sendMessageToSeller = async (req, res) => {
    try {

        let { propertyId,
            name,
            phone,
            message } = req.body

        let checkIfExist = await prisma.Property.find({
            where: {
                id: propertyId
            }
        })
        if (checkIfExist) {
            let checkUser = await prisma.user.find({
                where: {
                    id: parseInt(req.query.id)
                }
            })

            if (checkUser) {
                let newMessage = await prisma.Message.create({
                    propertyId: propertyId,
                    userId: parseInt(req.query.id),
                    name: name,
                    phone: phone,
                    message: message
                })

                await prisma.User.update({
                    where: { id: parseInt(req.query.id) },
                    data: {
                        sentMessages: sentMessages.push(newMessage)
                    }
                })
                let propertyData = await prisma.Property.find({
                    where: {
                        id: propertyId
                    }
                })
                let _sellerId = propertyData.sellerId

                await prisma.Seller.update({
                    where: { id: _sellerId },
                    data: {
                        sentMessages: sentMessages.push(newMessage)
                    }
                })

            }
        }

    } catch {
        console.error
    }
}



const client = new OAuth2Client(GOOGLE_CLIENT_ID);

exports.loginViaGoogle = async (req, res) => {

    try {
        const g_token = req.body.token;
        const ticket = await client.verifyIdToken({
            idToken: g_token,
            audience: GOOGLE_CLIENT_ID,
        });
        const profile = ticket.getPayload();

        let filter;
        // If already Logged in then connect
        if ("token" in req.cookies || "authorization" in req.headers) {
            const token =
                req.cookies.token || req.header("Authorization").replace("Bearer ", "");
            console.log(token);
            const decoded = jwt.verify(token, JWT_SECRET);

            filter = { _id: decoded.id };
            console.log("Connected w/ google");
        } else {
            // Login or Sign up w/ Google
            filter = { email: profile.email };
            console.log("LOGIN || SIGNUP W/ GOOGLE");
        }

        // update/insert user's google details
        const options = {
            upsert: true, // Perform an upsert operation
            new: true, // Return the updated document, instead of the original
            setDefaultsOnInsert: true, // Set default values for any missing fields in the original document
        };
        let user = await prisma.User.findUnique({
            where: {
                googleId: profile.sub,
                email: profile.email,
            }
        })
        console.log("new user: " + user)
        // add name if missing or if new user
        if (!user.name) {
            user = await prisma.User.create({
                data: {
                    name: profile.name,
                    email: profile.email,

                    googleId: profile.sub,
                    photoUrl: profile.picture,

                }
            })
        }



        // return jwt token
        cookieToken(user, res);
    } catch (error) {
        console.log(error);
        return new HTTPError(res, 500, error, "internal server error");
    }
};


exports.loginWithPhone = async () => {
    console.log("Yet to create function")
}


//Helper upload to S3

const updateProfileImage = async (user, photo) => {
    try {
        const convertedBuffer = await sharp(photo.data).toFormat("webp").toBuffer();
        let data = await uploadToS3(
            "truts-users",
            user._id + ".webp",
            convertedBuffer
        );
        return data;
    } catch (error) {
        throw error;
    }
};