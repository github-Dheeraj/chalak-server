const express = require('express')
const router = express.Router()
const HTTPError = require("../utils/httpError");
const { HTTPResponse } = require("../utils/httpResponse");
const {
    createProperty, updateProperty, deleteProperty
} = require("../controllers/propertyController")
const { upload } = require("../utils/awsStorage")


router.route("/create").post(upload.array("images", 15), createProperty)
router.route("/update").put(upload.array("images", 15), updateProperty)

router.route("/delete").delete(deleteProperty)
module.exports = router
