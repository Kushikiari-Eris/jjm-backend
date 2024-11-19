const express = require('express')
const router = express.Router()
const AIController = require('../controller/AIController')

router.post('/prompt', AIController.prompt)
router.get('/prompt', AIController.showAllAuditPlan)
router.patch('/prompt/:id/progress', AIController.progressAudit)

module.exports = router