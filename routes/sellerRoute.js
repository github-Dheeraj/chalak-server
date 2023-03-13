const express = require('express')
const router = express.Router()
const { createSeller, deleteSeller, updateSeller,  getAllMessages, checkSellerDetails } = require("../controllers/sellerController")

router.route("/create").post(createSeller)
// router.route("/phoneLogmin").post(loginWithPhone)

router.route("/delete").get(deleteSeller)
router.route("/update").post(updateSeller)

router.route("/check").get(checkSellerDetails)
router.route("/getMessages").get(getAllMessages)

module.exports = router
