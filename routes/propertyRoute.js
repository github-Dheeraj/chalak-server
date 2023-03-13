const express = require('express')
const router = express.Router()
const {
    createProperty, updateProperty
} = require("../controllers/propertyController")
const { upload } = require("../utils/awsStorage")

router.route("/create").post(upload.array("images", 15), createProperty)
router.route("/update").put(upload.array("images", 15), updateProperty)
module.exports = router