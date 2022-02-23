const {Schema, model} = require('mongoose')

const schema = new Schema ({
	userId: {type: String, required: true},
	assistId: {type: String},
	username: {type: String, required: true},
	club: {type: String},
	place: {type: Number},
	bidStatus: {type: String},
	coeff: {type: Number},
	money: {type: Number},
	players: {type: Number},
	password: {type: String, required: true},
	extracoeff: {type: Number, default: 1.0} 
})

module.exports = model('User', schema)