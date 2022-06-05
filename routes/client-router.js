const multer = require('multer')
const router = require('express').Router()
const ClientController = require('../controllers/client-controller')

let upload = multer({})

// const checkAuthentication = (req, res, next) => {
//   if (req.session.student) next() 
//   else res.redirect('/student/login')
// }

// router.get('/login', ClientController.getLoginPage)

// router.post('/login', ClientController.handleLogin)

// router.get('/logout', ClientController.handleLogout)

// router.use(checkAuthentication)

router.get('/', ClientController.getHomePage)

router.get('/make-enquiry', ClientController.getEnquiryPage)

router.post('/send-enquiry', ClientController.processSendEnquiry)

router.get('/send-eyewitness-report', ClientController.sendEyeWitnessReportPage)

router.post('/send-eyewitness-report', upload.single('image'), ClientController.sendEyeWitnessReport)

module.exports = router