const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let EyeWitnessReportSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  sender_name: {
    type: String,
  },
  sender_phone: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  type_of_report: {
    type: String,
  },
  time_posted: {
    type: Date,
    default: Date.now
  },
  is_read: {
    type: Boolean,
    default: false,
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

EyeWitnessReportSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("eye_witness_reports_id")
  }
  next()
})

module.exports = mongoose.model('eye_witness_report', EyeWitnessReportSchema)
