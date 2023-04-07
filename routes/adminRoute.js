const express = require('express')
const router = express.Router()

const { signUp } = require('../utils/whatsApp')
const { getInTouchAdmin } = require('../controllers/adminController')
router.route('/waSignUp').post(signUp)
router.route('/getInTouch').post(getInTouchAdmin)
module.exports = router