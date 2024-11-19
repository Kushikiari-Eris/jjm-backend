const express = require('express')
const router = express.Router()
const addressController = require('../controller/addressController')


router.post('/addresses', addressController.createAddress);
router.get('/addresses/:userId', addressController.getUserAddresses);
router.put('/addresses/:addressId', addressController.updateAddress);
router.delete('/addresses/:addressId', addressController.deleteAddress);
router.patch('/addresses/default', addressController.setDefaultAddress);

module.exports = router