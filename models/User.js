const {Schema, model} = require('mongoose')

const schema = new Schema ({
	userId: {type: String, required: true},
	assistId: {type: String, default: ""},
	username: {type: String},
	place: {type: Number},
	club: {type: String},
	currentRound: {type: Number, default: 1},
	nextRound: {type: Number, default: 1},
	coeff: {type: Number, default: 1},
	money: {type: Number},
	players: {type: Number}
})

module.exports = model('User', schema)