const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let OffendingDriverSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  fullname: {
    type: String,
  },
  phone: {
    type: String,
  },
  driver_license: {
    type: String,
  },
  offense: {
    type: String,
  },
  date_of_offense: {
    type: String,
  },
  image: {
    type: String,
  },
  image_public_id: {
    type: String,
  }
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

OffendingDriverSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("offending_drivers_id")
  }
  next()
})

module.exports = mongoose.model('tourist', OffendingDriverSchema)
