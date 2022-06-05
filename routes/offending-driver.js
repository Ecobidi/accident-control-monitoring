const router = require('express').Router()
const multer = require('multer')

const OffendingDriver = require('../controllers/offending-driver')
const UserController = require('../controllers/user')

const upload = multer({})

router.get('/', OffendingDriver.getOffendersPage)

router.get('/new', OffendingDriver.createOffenderPage)

router.post('/new', upload.single('image'), OffendingDriver.createOffender)

router.get('/update/:serial_number', OffendingDriver.editOffenderPage)

router.post('/update', upload.single('image'), OffendingDriver.editOffender)

router.get('/remove/:offender_id', UserController.hasAdminAuthorization, OffendingDriver.removeOffender)

module.exports = router