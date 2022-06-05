const sharp = require('sharp')
const { streamUpload, removeUploadedFile } = require('../config/cloudinary')

const EyeWitnessService = require('../services/eye-witness-report')
const AccidentModel = require('../models/accident')
const EnquiryService = require('../services/enquiry')

class ClientController {
  static async getHomePage(req, res) {
    let accidents = await AccidentModel.find().sort('-_id').limit(10)
    res.render('client/home', { accidents })
  }

  // static async getAccidentDetails(req, res) {
  //   let tour = await TourService.findBySerialNumber(req.params.tour_id)
  //   res.render('client/tour-detail', { tour })
  // }

  static async getEnquiryPage(req, res) {
    res.render('client/make-enquiry')
  }

  static async processSendEnquiry(req, res) {
    let dao = req.body
    try {
      await EnquiryService.create(dao)
      req.flash('success_msg', 'Enquiry Sent')
      res.redirect('/make-enquiry')
    } catch (error) {
      console.log(error)
      req.flash('error_msg', 'Error sending enquiry')
      res.redirect('/make-enquiry')
    }
  }

  static async sendEyeWitnessReportPage(req, res) {
    res.render('client/eye-witness-report')
  }

  static async sendEyeWitnessReport(req, res) {
    let dao = req.body
    console.log(dao)
    try {
      if (req.file) {
        let editedImage = await sharp(req.file.buffer).resize(620, 580).toBuffer()
        const imageInfo = await streamUpload(editedImage, process.env.PROJECT_CLOUDINARY_IMAGE_FOLDER + "/reports")
        dao.image = imageInfo.url
        dao.image_public_id = imageInfo.public_id
      }
      await EyeWitnessService.create(dao)
      req.flash('success_msg', "Report Sent")
      res.redirect('/send-eyewitness-report')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error Sending Report')
      res.redirect('/send-eyewitness-report')
    }
  }
}


module.exports = ClientController