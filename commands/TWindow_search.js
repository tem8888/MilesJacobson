const Transfer = require('../models/Transfer')

module.exports = {
	name: 'search',
	description: 'Search player',
	execute(message, args) {
		
	Transfer.findOne({name: {$regex: args[0], $options: 'i'}}).then((player) => {
		!player ? message.channel.send('❌ Игрок не найден.') :
		message.channel.type !== 'dm' ?
		message.channel.send(`>>> Игрок: **${player.name}**\nID: **${player.uid}**\nСтоимость: **${player.price}**`)
		:
		message.channel.send(`>>> Игрок: **${player.name}**\nID: **${player.uid}**\nСтоимость: **${player.price}**\n
_Нажмите на реакцию, чтобы сделать бид. 
Каждая реакция соответствует коэффициенту увеличения ставки:  **× 1**   **× 1.1**  **× 1.25**   **× 1.5**_`)
			.then((msg) => {
				msg.react('➡️')
				msg.react('↗️')
				msg.react('⬆️')
				msg.react('⏏️')
			})
	})
	
	}
}