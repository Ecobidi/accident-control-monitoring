const router = require('express').Router()
const UserService = require('../services/user')

router.get('/', async (req, res) => {
  res.render('login')
})

router.post('/', async (req,res) => {
  let dao = req.body
  try {
    //  
    let user = await UserService.findByUsername(dao.username)
    // check for password match
    if (user && user.password == dao.password) {
      req.session.loggedIn = true
      req.session.user = user
      res.redirect('/admin/dashboard')
    } else {
      req.flash('error_msg', 'Incorrect Login Details')
      res.redirect('/admin/login')
    }
  } catch (err) {
    console.log(err)
    req.flash('error_msg', 'Something went wrong, try again!')
    res.redirect('/admin/login')
  }
})

module.exports = router