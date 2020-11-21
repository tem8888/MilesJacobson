const { Schema, model } = require('mongoose')

const schema = new Schema({
  userId: {type: String, required: true},
  club: {type: String},
  place: {type: Number},
  coeff: {type: Number, default: 1},
  round: {type: Number, default: 0},
  player: {type: String},
  playerId: {type: String},
  price: {type: Number}
})

module.exports = model('Bid', schema)