

require('dotenv').config();
const express = require('express')
const cors = require('cors')
const userRoute = require("./routes/userRoute")
const propertyRoute = require("./routes/propertyRoute")
const sellerRoute = require("./routes/sellerRoute")
const adminRoute = require("./routes/adminRoute")
const { signUp } = require('./utils/whatsApp');
const cookieParser = require("cookie-parser");
const HTTPError = require("./utils/HTTPError");
const { HTTPResponse } = require("./utils/httpResponse.js");
const app = express()
var subdomain = require('express-subdomain');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// BASIC SERVER CONFIGS
// BASIC SERVER CONFIGS
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/user', userRoute)

app.use("/property", propertyRoute)

app.use("/seller", sellerRoute)

app.use("/admin", adminRoute)

// app.get("/whatsApp", signUp)

app.get("/", (req, res, next) => {
    try {
        return new HTTPResponse(res, true, 200, "Server initiated", null, null)
    } catch {
        return new HTTPError(res, 400, err, "internal server error")
    }
})

app.get("/get", (req, res) => {
    res.send({ message: "GET is called" })
})
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT} `);
});


// app.post("/upload", upload.array("images", 15), (req, res, next) => {
//     console.log(req.files)
// })
