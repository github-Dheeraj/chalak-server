

require('dotenv').config();

const express = require('express')
const cors = require('cors')
const fileUpload = require("express-fileupload")
const { PrismaClient } = require('@prisma/client')

const sellerRoute = require("../routes/sellerRoute")
const userRoute = require("../routes/userRoute")
const propertyRoute = require("../routes/propertyRoute")
const { auth, requiresAuth } = require('express-openid-connect');
const { upload } = require('../utils/awsStorage')

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.OAUTH_SECRET_KEY,
    baseURL: 'http://localhost:5000',
    clientID: 'YBcJl0NMgG4DFAtYACI5Sz4x1TQKcbTs',
    issuerBaseURL: 'https://dev-l2eeqw7ltkafqgtn.us.auth0.com'
};

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// BASIC SERVER CONFIGS
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// OAUTH 
// auth router attaches /login, /logout, and /callback routes to the baseURL

// app.use(auth(config));

// req.isAuthenticated is provided from the auth router

// app.get('/', (req, res) => {
//     res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

// app.get('/profile', requiresAuth(), (req, res) => {
//     res.send(JSON.stringify(req.oidc.user));
// });

// app.use("/seller", () => {
//     console.log("seller route")
//     sellerRoute
// })

app.use("/user/seller", sellerRoute)

app.use("/user", userRoute)

app.use("/property", propertyRoute)

app.post("/upload", upload.array("images", 15), (req, res, next) => {
    console.log(req.files)
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT} `);
});

app.get("/", (req, res) => {
    console.log(`Request`)
    res.send("Callback reached")
})