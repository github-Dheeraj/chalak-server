
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const validator = require("validator");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
// const HTTPError = require("../utils/httpError");
const {
    JWT_SECRET,
    GOOGLE_CLIENT_ID,
} = require("../config/config");
require('dotenv').config();


//Comment this will not be used until login flow with Email and Password is Done
exports.createSeller = async (req, res, next) => {
    console.log("createSeller")
    console.log("req body", req.body)
    try {
        let { _businessId, _tags } = req.body

        let seller = await prisma.Seller.create({
            data: {
                userId: parseInt(req.query.id),
                businessId: _businessId,
                tags: _tags

            }
        })
        console.log("successfully seller", seller)
        if (seller) {
            console.log("this is a db res");
            return res.status(200).send(seller);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
    }
}


//comment discuss with Sidharth
exports.updateSeller = async (req, res) => {
    try {
        console.log('updateSeller')
        console.log("req body: ", req.body)

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
            return res.status(200).send(updateRes);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
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
            return res.status(200).send(sellerDetail);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
    }

}

exports.deleteSeller = async (req, res) => {
    try {
        const deleteUsers = await prisma.Seller.delete({
            where: {
                userId: parseInt(req.query.id)
            }
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
exports.getAllMessages = async (req, res, next) => {
    try {
        const getSeller = await prisma.Seller.findUnique({
            where: {
                userId: parseInt(req.query.id)
            }
        })
        if (getSeller) {
            console.log("this is a db res");
            return res.status(200).send(getSeller.messagesRecieved);

        } else {
            return res.status(500)
        }
    } catch {
        console.error
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
