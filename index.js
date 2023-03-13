

require('dotenv').config();

const express = require('express')
const cors = require('cors')
const userRoute = require("./routes/userRoute")
const propertyRoute = require("./routes/propertyRoute")
const { upload } = require('./utils/awsStorage')


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

app.post("/upload", upload.array("images", 15), (req, res, next) => {
    console.log(req.files)
})

app.get("/", (req, res) => {
    console.log(`Request`)
    res.send({ message: "Callback reached" })
})

app.get("/get", (req, res) => {
    res.send({ message: "GET is called" })
})
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT} `);
});

