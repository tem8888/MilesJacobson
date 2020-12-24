const User = require('../models/User')

module.exports = {
	name: 'end',
	description: 'Transfer Window ending',
	execute(message, args) {
		
		User.findOneAndUpdate({userId: message.author.id},{isFinished: true},{useFindAndModify: false}).then(() => {
			message.channel.send('✅ Клуб ${user.club} завершил трансферное окно.') 
		})
	
	}
}