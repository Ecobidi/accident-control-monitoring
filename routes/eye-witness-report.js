const router = require('express').Router()

const ReportController = require('../controllers/eye-witness-report')

router.get('/', ReportController.getEyeWitnessReportsPage)

// router.post('/resolve', ReportController.resolveEnquiry)

router.get('/remove/:report_id', ReportController.removeReport)

module.exports = router