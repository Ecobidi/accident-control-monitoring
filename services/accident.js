const AccidentModel = require('../models/accident')

class AccidentService {

  static QUERY_LIMIT_SIZE = 10;

  static async findById(id) {
    return AccidentModel.findById(id)
  }

  static async findBySerialNumber(serial_number) {
    return AccidentModel.findOne({serial_number})
  }

  static async searchBy(search = '', { offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    let pattern = new RegExp(search, 'ig')
    let docs = await AccidentModel.find({ $or: [{road: pattern}]}).skip(offset).limit(limit)
    
    return docs
  }
  
  static async findAll({ offset = 0, limit = this.QUERY_LIMIT_SIZE}) {
    return AccidentModel.find().skip(offset).limit(limit)
  }

  static async countMatchingDocuments(search = '') {
    let numberOfDocs
    let pattern = new RegExp(search, 'ig')
    if (search) {
      numberOfDocs = await AccidentModel.count({ $or: [{road: pattern}]})
    } else {
      numberOfDocs = await AccidentModel.count()
    }
    return numberOfDocs
  }

  static async create(dao) {
    return AccidentModel.create(dao)
  }

  static async updateOne(update) {
    return AccidentModel.findByIdAndUpdate(update._id, {$set: update})
  }

  static async removeOne(serial_number) {
    return AccidentModel.findOneAndDelete({serial_number})
  }

}

module.exports = AccidentService