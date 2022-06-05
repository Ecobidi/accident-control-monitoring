const mongoose = require('mongoose')
const DBCounterModel = require("./db_counter")

let AccidentSchema = new mongoose.Schema({
  serial_number: {
    type: Number,
    unique: true,
  },
  road: {
    type: String,
  },
  location: {
    type: String,
  },
  city: {
    type: String,
  },
  report: {
    type: String,
  },
  time_of_incident: {
    type: Date,
  },
  casualties: {
    type: String,
  },
  image: {
    type: String,
  },
  image_public_id: {
    type: String,
  },
  is_public: {
    type: Boolean,
    default: false,
  }
}, {timestamps: {createdAt: true}})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

AccidentSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue("accidents_id")
  }
  next()
})

module.exports = mongoose.model('accident', AccidentSchema)
