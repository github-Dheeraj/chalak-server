const express = require('express')
const router = express.Router()
const { createUser,
    deleteuser,
    updateUser,
    userBookmarkProperty,
    userUnBookmarkProperty,
    loginWithPhone,
    sendMessageToSeller
} = require("../controllers/userController")
const { upload } = require("../utils/awsStorage")

router.route("/create").post(upload.single("image"), createUser)
// router.route("/phoneLogmin").post(loginWithPhone)

router.route("/delete").get(deleteuser)
router.route("/update").post(upload.single("image"), updateUser)

router.route("/bookmarkProperty").get(userBookmarkProperty)
router.route("/unBookmarkProperty").get(userUnBookmarkProperty)
router.route("/sendMessage").post(sendMessageToSeller)

module.exports = router
