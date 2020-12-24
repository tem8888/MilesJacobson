const User = require('../models/User')

module.exports = {
	name: 'more',
	description: 'Who needs more transfers',
	execute(message, args) {
		
		User.findOneAndUpdate({$or: [{userId: message.author.id}, {assistId: message.author.id}]},{isFinished: false, coeff: 1},{useFindAndModify: false}).then((user) => {
			message.channel.send(`✅ Клуб ${user.club} готов снова тратить.`) 
		})
	
	}
}