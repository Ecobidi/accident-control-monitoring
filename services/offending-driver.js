const OffendingDriver = require('../models/offending-driver')

class OffendingDriverService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return OffendingDriver.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return OffendingDriver.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await OffendingDriver.find({ $or: [{fullname: pattern}]}).skip(offset).limit(limit).sort('-_id')
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return OffendingDriver.find().skip(offset).limit(limit).sort('-_id')
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await OffendingDriver.count({ $or: [{fullname: pattern}]})
    } else {
      numberOfDocs = await OffendingDriver.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return OffendingDriver.create(dao)
  }

  static async updateOne(update) {
    return OffendingDriver.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return OffendingDriver.findOneAndDelete({serial_number})
  }

}

module.exports = OffendingDriverService