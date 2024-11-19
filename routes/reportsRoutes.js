
const express = require('express')
const router = express.Router()
const reportsController = require('../controller/reportsController')

router.post('/reports', reportsController.createReport)
router.get('/reports', reportsController.getReports)
router.get('/reports/:id', reportsController.getReportById)
router.put('/reports/:id', reportsController.updateReport)
router.delete('/reports/:id', reportsController.deleteReport)


module.exports = router