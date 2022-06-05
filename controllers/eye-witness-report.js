const EyeWitnessService = require('../services/eye-witness-report')

class EyeWitnessReportController {

  static async getEyeWitnessReportsPage(req, res) {
    let pageNumber = Number.parseInt(req.query.page ? req.query.page : 1)
    let limit_size = Number.parseInt(req.query.limit || EyeWitnessService.QUERY_LIMIT_SIZE)
    let offset = pageNumber * limit_size - limit_size
    let search = req.query.search
    let reports, totalDocuments
    if (search) {
      reports = await EyeWitnessService.searchBy(search, {limit: limit_size, offset}) 
      totalDocuments = await EyeWitnessService.countMatchingDocuments(search)
    } else {
      reports = await EyeWitnessService.findAll({limit: limit_size, offset})
      totalDocuments = await EyeWitnessService.countMatchingDocuments()
    }
    let totalNumberOfPages = Math.ceil(await totalDocuments / limit_size)

    res.render('eye-witness-reports', { reports, currentPage: pageNumber, totalNumberOfPages, totalDocuments, limit_size, offset, searchTerm: search })
  }

  static async removeReport(req, res) {
    try {
      await EyeWitnessService.removeOne(req.params.report_id)
      req.flash('success_msg', 'Report removed')
      res.redirect('/admin/eyewitness-reports')
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Error removing record')
      res.redirect('/admin/eyewitness-reports')
    }
  }

}

module.exports = EyeWitnessReportController