const multer = require('multer')
const router = require('express').Router()

const UserController = require('../controllers/user')

const upload = multer({})

router.get('/', UserController.getAllUsersPage)

router.get('/new', UserController.hasAdminAuthorization, UserController.createUserPage)

router.post('/new', UserController.hasAdminAuthorization, upload.single('photo'), UserController.createUser)

router.get('/profile/:serial_number', UserController.getProfilePage)

router.get('/remove/:serial_number', UserController.hasAdminAuthorization, UserController.removeUser)

module.exports = router