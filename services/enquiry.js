const EnquiryModel = require('../models/enquiry')

class EnquiryService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return EnquiryModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return EnquiryModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await EnquiryModel.find({ $or: [{subject: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return EnquiryModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await EnquiryModel.count({ $or: [{subject: pattern}]})
    } else {
      numberOfDocs = await EnquiryModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return EnquiryModel.create(dao)
  }

  static async updateOne(update) {
    return EnquiryModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return EnquiryModel.findOneAndDelete({serial_number})
  }

}

module.exports = EnquiryService