const express = require('express')
const cartController = require('../controller/cartController')
const router = express.Router()

router.post('/cart', cartController.createCart)
router.get('/cart', cartController.showAllCart)
router.get('/cart/:userId', cartController.showCartByUser)
router.delete('/cart/:userId/:productId', cartController.deleteCartItem)
router.put('/cart/:userId/:productId', cartController.updateCartItem)

module.exports = router