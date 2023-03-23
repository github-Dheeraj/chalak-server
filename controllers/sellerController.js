
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
        let { _businessId, _tags } = req.body
        let userData = await prisma.User.findUnique({
            where: {
                id: parseInt(req.query.id)
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
        let sellerData = await prisma.Seller.findFirstOrThrow({
            where: {
                userId: parseInt(req.query.id)
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
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }


}

exports.checkSellerDetails = async (req, res) => {
    try {
        console.log("req query", req.query.id)
        // ... you will write your Prisma Client queries here
        const sellerDetail = await prisma.Seller.findUnique({
            where: {
                userId: parseInt(req.query.id)
            }
        })

        if (sellerDetail) {
            console.log("this is a db res");
            return new HTTPResponse(res, true, 200, null, null, { sellerDetail });

        } else {
            return new HTTPError(res, 404, null, "seller not found")
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
exports.getAllMessages = async (req, res, next) => {
    try {
        const getSeller = await prisma.Seller.findUnique({
            where: {
                userId: parseInt(req.query.id)
            }
        })
        if (getSeller) {
            console.log("this is a db res");
            return res.status(200).send({ data: getSeller.messagesRecieved });

        } else {
            return new HTTPError(res, 404, null, "seller not found")
        }
    } catch (err) {
        console.log(err);

        return new HTTPError(res, 400, err, "internal server error")
    }
}


// const client = new OAuth2Client(GOOGLE_CLIENT_ID);


// exports.loginViaGoogle = async (req, res) => {
//     try {
//         const g_token = req.body.token;
//         const ticket = await client.verifyIdToken({
//             idToken: g_token,
//             audience: GOOGLE_CLIENT_ID,
//         });
//         const profile = ticket.getPayload();

//         let filter;
//         // If already Logged in then connect
//         if ("token" in req.cookies || "authorization" in req.headers) {
//             const token =
//                 req.cookies.token || req.header("Authorization").replace("Bearer ", "");
//             console.log(token);
//             const decoded = jwt.verify(token, JWT_SECRET);

//             filter = { _id: decoded.id };
//             console.log("Connected w/ google");
//         } else {
//             // Login or Sign up w/ Google
//             filter = { email: profile.email };
//             console.log("LOGIN || SIGNUP W/ GOOGLE");
//         }

//         // update/insert user's google details
//         const options = {
//             upsert: true, // Perform an upsert operation
//             new: true, // Return the updated document, instead of the original
//             setDefaultsOnInsert: true, // Set default values for any missing fields in the original document
//         };



//         //If user exist add the google Id or createSeller for all the option given 
//         let user = await prisma.Seller.findUnique({
//             where: {
//                 googleId: profile.sub,
//                 email: profile.email,
//             }
//         })
//         console.log("new seller", user)
//         // add name if missing or if new user
//         if (!user.name) {
//             user = await prisma.User.update({
//                 where: { _id: user._id },
//                 data: { name: profile.name },

//             })
//         }


//         // return jwt token
//         cookieToken(user, res);
//     } catch (error) {
//         console.log(error);
//         return new HTTPError(res, 500, error, "internal server error");
//     }
// };


// exports.isLoggedIn = async (req, res, next) => {
//     try {
//         // if no token is sent
//         if (!("token" in req.cookies) && !("authorization" in req.headers)) {
//             return next(
//                 new HTTPError(
//                     res,
//                     401,
//                     "Login to access this resource",
//                     "Unauthorized client error"
//                 )
//             );
//         }

//         // fetch n decode the token
//         const token =
//             req.cookies.token ?? req.header("Authorization").replace("Bearer ", "");

//         const decoded = jwt.verify(token, JWT_SECRET);
//         // find the user
//         const user = await prisma.Seller.findUnique({
//             where: {
//                 id: decoded.id
//             }
//         });
//         // if no such user found
//         if (!user) {
//             req.user = {};
//             return next(
//                 new HTTPError(
//                     res,
//                     401,
//                     "invalid token",
//                     "Unauthorized client error - no such user"
//                 )
//             );
//         }

//         // add user to request object for further use
//         req.user = user;
//         next();
//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             return next(
//                 new HTTPError(
//                     res,
//                     403,
//                     "Auth token expired: please login again",
//                     "TokenExpired"
//                 )
//             );
//         }
//         console.log("LoggedIn: ", error);
//         return next(new HTTPError(res, 500, "Internal server error", error));
//     }
// };
exports.loginWithPhone = async () => {
    console.log("Yet to create function")
}

exports.signUp = async () => {
    console.log("Yet to create function signUp");
}

exports.Login = async () => {
    console.log("Yet to create function login");
}
