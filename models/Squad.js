const { Schema, model } = require('mongoose')

const schema = new Schema({
  uid: {type: String, required: true},
  name: {type: String},
  price: {type: Number},
  mins: {type: Number},
  club: {type: String}
})

module.exports = model('Squad', schema)