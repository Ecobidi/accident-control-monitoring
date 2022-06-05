const router = require('express').Router()
const multer = require('multer')

const AccidentController = require('../controllers/accident')
const UserController = require('../controllers/user')

const upload = multer({})

router.get('/', AccidentController.getAccidentsPage)

router.get('/new', AccidentController.createAccidentPage)

router.post('/new', upload.single('image'), AccidentController.createAccident)

router.get('/update/:serial_number', AccidentController.editAccidentPage)

router.post('/update', upload.single('image'), AccidentController.editAccident)

router.get('/remove/:accident_id', UserController.hasAdminAuthorization, AccidentController.removeAccident)

module.exports = router