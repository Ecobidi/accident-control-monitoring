const sharp = require('sharp')
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')
const path = require('path')
const UserService = require('../services/user')

class UserController {

  static hasAdminAuthorization(req, res, next) {
    // if (req.session.user && req.session.user.role == "admin") {
    //   next()
    // } else {
    //   req.flash('error_msg', 'Attempted Unauthorized Operation')
    //   res.redirect('/admin/')
    // }
    next()
  }

  static async getProfilePage(req, res) {
    let serial_number = req.params.serial_number
    let user = await UserService.findBySerialNumber(serial_number)
    res.render('user-profile', { user })
  }

  static async getAllUsersPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || UserService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let users, totalDocuments
    if (search) {
      users = await UserService.searchByName(search, {limit: limit_size, offset}) 
      totalDocuments = await UserService.countMatchingDocuments(search)
    } else {
      users = await UserService.findAll({limit: limit_size, offset})
      totalDocuments = await UserService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('users', {users, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset })

  }

  static async createUserPage(req, res) {
    res.render('users-new', { error_msg: req.flash('error_msg') })
  }

  static async createUser(req, res) {
    let dao = req.body
    console.log(dao)
    if (dao.password != dao.retype_password) {
      req.flash('error_msg', 'Passwords do not match')
      return res.redirect('/admin/users/new')
    } 
    try {
      // check for same username
      let sameUsername1 = await UserService.findByUsername(dao.username)
      if (sameUsername1) {
        req.flash('error_msg', 'Username is already taken')
        return res.redirect('/admin/users/new')
      }
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + '/users')
        dao.photo = imageInfo.url
        dao.photo_public_id = imageInfo.public_id
      }
      let user = await UserService.create(dao)
      req.flash("success_msg", "User successfully created")
      res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
      res.redirect('/admin/users')
    }

  }

  static async resetPassword(req, res) {
    let user = await UserService.findByEmail(req.session.user.email)
    if (user) {
      if (req.body.oldPassword == user.password && req.body.newPassword == req.body.newPassword2) {
        user.password = req.body.newPassword
        await user.save()
        req.flash('success_msg', 'Password successfully changed')
        res.redirect('/admin/logout')
      } else {
        req.flash('error_msg', 'Passwords do not match, Try Again')
        res.redirect('/admin/')
      }
    } else {
      res.redirect('/admin/logout')
    }
  }

  // static async changeProfilePhoto(req, res) {
  //   let user = req.session.user
  //   if (req.files) {
  //     let file = req.files.photo
  //     let extname = path.extname(file.name)
  //     let filename = user.serial_number + extname
  //     await file.mv(process.cwd() + '/uploads/images/users/' + filename)
  //     // user.photo = filename
  //     // await user.save()
  //     req.flash('success_msg', 'Picture changed successfully')
  //     res.redirect('/admin/users/profile/'+user.serial_number)
  //   }
  // }

  static async removeUser(req, res) {
    try {
      let doc = await UserService.removeOne(req.params.serial_number)
      // remove photo
      if (doc.photo_public_id) {
        await removeUploadedFile(doc.photo_public_id)  
      }
      // await fs.unlink(process.cwd() + '/uploads/images/users/' + doc.photo)
      req.flash('success_msg', 'User removed successfully')
      res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Last Operation Failed')
      res.redirect('/admin/users')
    }
  }

}

module.exports = UserController