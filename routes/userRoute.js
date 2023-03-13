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

router.route("/create").post(createUser)
// router.route("/phoneLogmin").post(loginWithPhone)

router.route("/delete").get(deleteuser)
router.route("/update").post(updateUser)

router.route("/bookmarkProperty").get(userBookmarkProperty)
router.route("/unBookmarkProperty").get(userUnBookmarkProperty)
router.route("/sendMessage").post(sendMessageToSeller)

module.exports = router
