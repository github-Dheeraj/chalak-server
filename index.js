

require('dotenv').config();



const express = require('express')
const cors = require('cors')
const userRoute = require("./routes/userRoute")
const propertyRoute = require("./routes/propertyRoute")
const sellerRoute = require("./routes/sellerRoute")
const { upload } = require('./utils/awsStorage')
const { signUp } = require('./utils/whatsApp');
const { checkout } = require('./routes/userRoute');

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


app.use("/user", userRoute)

app.use("/property", propertyRoute)

app.use("/seller", sellerRoute)


app.get("/whatsApp", signUp)

app.get("/", (req, res, next) => {
    try {
        res.status(201).send({ message: "Server Initiated" })
    } catch {
        res.status(404).send({ message: "Please check the connection" })
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
