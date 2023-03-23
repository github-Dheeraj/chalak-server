const express = require('express')
const router = express.Router()
const { createUser,
    deleteuser,
    updateUser,
    userBookmarkProperty,
    userUnBookmarkProperty,
    loginWithPhone,
    checkUserDetails,
    sendMessageToSeller,
    loginUser
} = require("../controllers/userController")
const { upload } = require("../utils/awsStorage")
const HTTPError = require("../utils/HTTPError");
const { HTTPResponse } = require("../utils/httpResponse");

router.route("/create").post(upload.single("image"), createUser)
router.route("/login").post(loginUser)

router.route("/delete").post(deleteuser)
router.route("/update").post(upload.single("image"), updateUser)
router.route("/getDetail").get(checkUserDetails)

router.route("/bookmarkProperty").post(userBookmarkProperty)
router.route("/unBookmarkProperty").post(userUnBookmarkProperty)
router.route("/sendMessage").post(sendMessageToSeller)

module.exports = router
