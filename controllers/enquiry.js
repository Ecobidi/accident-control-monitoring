const EnquiryService = require('../services/enquiry')

class EnquiryController {

  static async getEnquiriesPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || EnquiryService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let enquiries, totalDocuments
    if (search) {
      enquiries = await EnquiryService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await EnquiryService.countMatchingDocuments(search)
    } else {
      enquiries = await EnquiryService.findAll({limit: limit_size, offset})
      totalDocuments = await EnquiryService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('enquiries', { enquiries, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async resolveEnquiry(req, res) {
    await EnquiryService.updateOne(req.params.enquiry_id, {is_resolved: true})
    res.flash('success_msg', 'Enquiry marked as resolved')
    res.redirect('/admin/enquiries')
  }

  static async removeEnquiry(req, res) {
    try {
      await EnquiryService.removeOne(req.params.enquirie_id)
      req.flash('success_msg', 'Enquiry removed')
      res.redirect('/admin/enquiries')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/admin/enquiries')
    }
  }

}

module.exports = EnquiryController