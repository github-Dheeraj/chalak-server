const express = require('express')
const router = express.Router()

const { signUp } = require('../utils/whatsApp')

router.route('/waSignUp').post(signUp)

module.exports = router