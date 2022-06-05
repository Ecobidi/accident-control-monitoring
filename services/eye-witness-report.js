const EyeWitnessReport = require('../models/eye-witness-report')

class EyeWitnessService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return EyeWitnessReport.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return EyeWitnessReport.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await EyeWitnessReport.find({ $or: [{subject: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return EyeWitnessReport.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await EyeWitnessReport.count({ $or: [{subject: pattern}]})
    } else {
      numberOfDocs = await EyeWitnessReport.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return EyeWitnessReport.create(dao)
  }

  static async updateOne(update) {
    return EyeWitnessReport.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return EyeWitnessReport.findOneAndDelete({serial_number})
  }

}

module.exports = EyeWitnessService