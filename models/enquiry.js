const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let EnquirySchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  sender_email: {
    type: String,
  },
  sender_name: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  time_posted: {
    type: Date,
    default: Date.now
  },
  is_read: {
    type: Boolean,
    default: false,
  }
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

EnquirySchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("enquiries_id")
  }
  next()
})

module.exports = mongoose.model('enquiries', EnquirySchema)
