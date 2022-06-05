const router = require('express').Router()

const ClientRouter = require('./client-router')

const EnquiryRouter = require('./enquiry')
const OffenderRouter = require('./offending-driver')
const AccidentRouter = require('./accident')
const EyeWitnessRouter = require('./eye-witness-report')
const UserRouter = require('./user')
const LoginRouter = require('./login')

const getDashboard = (req, res) => {
  res.render('dashboard')
}

router.use(ClientRouter)

router.use('/admin/login', LoginRouter)

router.use((req, res, next) => {
  if (req.session.user) next()
  else res.redirect('/admin/login')
})

router.get('/admin', getDashboard)

router.get('/admin/dashboard', getDashboard)

router.use('/admin/accidents', AccidentRouter)

router.use('/admin/enquiries', EnquiryRouter)

router.use('/admin/eyewitness-reports', EyeWitnessRouter)

router.use('/admin/offenders', OffenderRouter)

router.use('/admin/users', UserRouter)

router.use('/admin/logout', (req, res) => {
  req.session.user = null
  res.redirect('/admin/login')
})

module.exports = router