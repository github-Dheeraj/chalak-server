const express = require('express')
const router = express.Router()
const { createUser,
    deleteuser,
    updateUser,
    userBookmarkProperty,
    userUnBookmarkProperty,
    loginWithPhone,
    sendMessageToSeller,
    loginUser
} = require("../controllers/userController")
const { upload } = require("../utils/awsStorage")
const HTTPError = require("../utils/httpError");
const { HTTPResponse } = require("../utils/httpResponse");

router.route("/create").post(upload.single("image"), createUser)
router.route("/login").post(loginUser)

router.route("/delete").get(deleteuser)
router.route("/update").post(upload.single("image"), updateUser)

router.route("/bookmarkProperty").get(userBookmarkProperty)
router.route("/unBookmarkProperty").get(userUnBookmarkProperty)
router.route("/sendMessage").post(sendMessageToSeller)

module.exports = router
