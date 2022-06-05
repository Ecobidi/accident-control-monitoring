const sharp = require('sharp')
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')

const AccidentModel = require('../models/accident')
const AccidentService = require('../services/accident')

class AccidentController {

  static async getAccidentsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || AccidentService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let accidents, totalDocuments
    
    if (search) {
      accidents = await AccidentService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await AccidentService.countMatchingDocuments(search)
    } else {
      accidents = await AccidentService.findAll({limit: limit_size, offset})
      totalDocuments = await AccidentService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('accidents', { accidents, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async createAccidentPage(req, res) {
    let accident = new AccidentModel()
    res.render('accidents-new', { accident, newAccident: true })
  }

  static async createAccident(req, res) {
    let dao = req.body
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/accidents")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await AccidentService.create(dao)
      req.flash('success_msg', "Record Saved")
      res.redirect('/admin/accidents')
    } catch (err) {
      console.log(err)
      res.redirect('/admin/accidents')
    }
  }

  static async editAccidentPage(req, res) {
    let serial_number = req.params.serial_number
    let accident = await AccidentService.findBySerialNumber(serial_number)
    res.render('accidents-new', { accident, newAccident: false })
  }

  static async editAccident(req, res) {
    let dao = req.body
    try {
      let accident = await AccidentService.findById(dao._id)
      if (req.file) {
        accident.image_public_id && await removeUploadedFile(accident.image_public_id)
        
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/accidents")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await AccidentService.updateOne(dao)
      req.flash('success_msg', "Record Updated")
      res.redirect('/admin/accidents')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error processing update')
      res.redirect('/admin/accidents')
    }
  }

  // static async editAccident(req, res) {
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

  static async removeAccident(req, res) {
    try {
      let doc = await AccidentService.removeOne(req.params.accident_id)
      // remove photo
      if (doc.image_public_id) {
        await removeUploadedFile(doc.image_public_id)  
      }
      req.flash('success_msg', 'Record removed successfully')
      res.redirect('/admin/accidents')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/admin/accidents')
    }
  }

}

module.exports = AccidentController