const Transfer = require('../models/Transfer')

module.exports = {
	name: 'search',
	description: 'Search player',
	execute(message, args) {
		
	Transfer.findOne({name: {$regex: args[0], $options: 'i'}}).then((player) => {
		!player ? message.channel.send('Игрок не найден.') :
		message.channel.type !== 'dm' ?
		message.channel.send(`>>> Игрок: **${player.name}**\nID: **${player.uid}**\nСтоимость: **${player.price}**`)
		:
		message.channel.send(`>>> Игрок: **${player.name}**\nID: **${player.uid}**\nСтоимость: **${player.price}**\n\n_нажмите на реакцию, чтобы сделать бид_`)
			.then((msg) => msg.react('💷'))
	})
	
	}
}