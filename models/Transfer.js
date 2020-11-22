const { Schema, model } = require('mongoose')

const schema = new Schema({
  uid: {type: String, required: true},
  name: {type: String},
  price: {type: String},
  status: {type: String, default: ''}
})

module.exports = model('Transfer', schema)