const router = require('express').Router()

const EnquiryController = require('../controllers/enquiry')

router.get('/', EnquiryController.getEnquiriesPage)

router.post('/resolve', EnquiryController.resolveEnquiry)

router.get('/remove/:enquiry_id', EnquiryController.removeEnquiry)

module.exports = router