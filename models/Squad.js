const { Schema, model } = require('mongoose')

const schema = new Schema({
  club: { type: String },
  uid: { type: String, required: true },
  name: { type: String },
  value: { type: Number, default: 0 },
})

module.exports = model('Squad', schema)
