const {Schema, model} = require('mongoose')

const schema = new Schema ({
	userId: {type: String, required: true},
	username: {type: String},
	place: {type: Number},
	club: {type: String},
	currentRound: {type: Number, default: 1},
	nextRound: {type: Number, default: 1},
	coeff: {type: Number, default: 1},
	signs: {type: Number},
	money: {type: Number}
})

module.exports = model('User', schema)