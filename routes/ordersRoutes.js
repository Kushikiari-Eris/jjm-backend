const express = require('express')
const ordersController = require('../controller/ordersController')
const router = express.Router()

router.post('/orders', ordersController.orders)
router.get('/orders', ordersController.showAllOrders)
router.get('/orders/:userId', ordersController.showOrdersByUser)
router.get('/orders/:id', ordersController.showOrderById)
router.patch('/orders/:orderId', ordersController.confirmOrder)
router.patch('/orders/:orderId/cancel', ordersController.cancelOrder)

module.exports = router