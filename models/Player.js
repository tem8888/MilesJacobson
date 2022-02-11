const { Schema, model } = require('mongoose')

const schema = new Schema({
  uid: {type: String, required: true},
  name: {type: String},
  price: {type: Number},
  age: {type: Number},
  ca: {type: Number},
  pa: {type: Number},
  status: {type: String, default: ''}
})

module.exports = model('Player', schema)