const express = require('express')
const router = express.Router()
const AIMaintenance = require('../controller/AIMaintenanceController')

router.post('/autoSched', AIMaintenance.autoScheduling)
router.get('/autoSched', AIMaintenance.showAllAutoScheduling)

module.exports = router