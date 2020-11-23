const { Schema, model } = require('mongoose')

const schema = new Schema({
  uid: {type: String, required: true},
  name: {type: String},
  price: {type: Number, default: 0},
  mins: {type: Number, default: 0},
  club: {type: String}
})

module.exports = model('Squad', schema)