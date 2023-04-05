const express = require('express')
const router = express.Router()
const HTTPError = require("../utils/HTTPError");
const { HTTPResponse } = require("../utils/httpResponse");
const {
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyDetails,
    getPropertyListUser,
    updatePropertyStatus,
    sendMessageToSeller,
    getIntrestedMessages,
    getPropertyListUserId
} = require("../controllers/propertyController")
const { upload } = require("../utils/awsStorage")


router.route("/create").post(upload.array("images", 15), createProperty)
router.route("/update").post(upload.array("images", 15), updateProperty)
router.route("/updateStatus").post(updatePropertyStatus)

router.route("/getDetail").get(getPropertyDetails)

router.route("/delete").post(deleteProperty)

router.route("/getProperties").get(getPropertyListUser)

router.route("/sendMessage").post(sendMessageToSeller)

router.route("/getMessages").get(getIntrestedMessages)

router.route("/getPage").get(getPropertyListUserId)

router.get('/', function (req, res) {
    res.send('Welcome to our API!');
});
module.exports = router
