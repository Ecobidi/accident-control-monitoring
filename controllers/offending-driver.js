const sharp = require('sharp')
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')

const OffenderModel = require('../models/offending-driver')
const OffendingDriverService = require('../services/offending-driver')

class OffenderController {

  static async getOffendersPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || OffendingDriverService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let offenders, totalDocuments
    
    if (search) {
      offenders = await OffendingDriverService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await OffendingDriverService.countMatchingDocuments(search)
    } else {
      offenders = await OffendingDriverService.findAll({limit: limit_size, offset})
      totalDocuments = await OffendingDriverService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('offenders', { offenders, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createOffenderPage(req, res) {
    let offender = new OffenderModel()
    res.render('offenders-new', { offender, newOffender: true, })
  } 

  static async createOffender(req, res) {
    let dao = req.body
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/offenders")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await OffendingDriverService.create(dao)
      req.flash('success_msg', "Record Saved")
      res.redirect('/admin/offenders')
    } catch (err) {
      console.log(err)
      res.redirect('/admin/offenders')
    }
  }

  static async editOffenderPage(req, res) {
    let serial_number = req.params.serial_number
    let offender = await OffendingDriverService.findBySerialNumber(serial_number)
    res.render('offenders-new', { offender, newOffender: false })
  }

  static async editOffender(req, res) {
    let dao = req.body
    try {
      let offender = await OffendingDriverService.findById(dao._id)
      if (req.file) {
        offender.image_public_id && await removeUploadedFile(offender.image_public_id)
        
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/offenders")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await OffendingDriverService.updateOne(dao)
      req.flash('success_msg', "Record Updated")
      res.redirect('/admin/offenders')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error processing update')
      res.redirect('/admin/offenders')
    }
  }

  // static async editTourPackagePage(req, res) {
  //   const packageTypes = ['Couple Package', 'Family Package', 'Group Package', 'Individual Package']
  //   let serial_number = req.params.serial_number
  //   let tour = await AccidentService.findBySerialNumber(serial_number)
  //   res.render('edit-tour-package', { packageTypes, tour })
  // }

  // static async editTourPackage(req, res) {
  //   let dao = req.body
  //   try {
  //     let tour = await AccidentService.findById(dao._id)
  //     if (req.file) {
  //       // remove prev image
  //       tour.tour_featured_image_public_id && await removeUploadedFile(tour.tour_featured_image_public_id)
  //       let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
  //       const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/accidents")
  //       dao.photo = imageInfo.url
  //       dao.photo_public_id = imageInfo.public_id
  //     }
  //     await AccidentService.updateOne(dao)
  //     req.flash('success_msg', "Tour Detail updated")
  //     res.redirect('/admin/accidents')
  //   } catch (err) {
  //     console.log(err)
  //     req.flash('error_msg', 'Error processing update')
  //     res.redirect('/admin/accidents')
  //   }
  // }

  // TODO Implement Image Cleanup After Record Removal

  static async removeOffender(req, res) {
    try {
      let doc = await OffendingDriverService.removeOne(req.params.offender_id)
      // remove photo
      if (doc.image_public_id) {
        await removeUploadedFile(doc.image_public_id)  
      }
      req.flash('success_msg', 'Record removed successfully')
      res.redirect('/admin/offenders')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/admin/offenders')
    }
  }

}

module.exports = OffenderController