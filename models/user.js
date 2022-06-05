const mongoose = require('mongoose')
const DBCounterModel = require('./db_counter')

let UserSchema = new mongoose.Schema({
  serial_number: {
    unique: true,
    type: Number,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  other_names: {
    type: String,
  },
  surname: {
    type: String
  },
  email: String,
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  photo: {
    type: String,
  }
}, {timestamps: { createdAt: true }})

async function getNextSequenceValue(sequenceName) {
  var sequenceDocument = await DBCounterModel.findOneAndUpdate({ key: sequenceName }, { $inc: { sequence_value: 1}})
  return sequenceDocument.sequence_value
}

UserSchema.pre("save", async function(next){
  if (this.serial_number == undefined) {
    this.serial_number = await getNextSequenceValue('users_id')
  }
  next()
})

module.exports = mongoose.model('user', UserSchema)