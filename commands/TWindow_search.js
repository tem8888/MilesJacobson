const Transfer = require('../models/Transfer')

module.exports = {
	name: 'search',
	description: 'Search player',
	execute(message, args) {

	//if (message.channel.type !== 'dm') 
	//	return
		
	Transfer.findOne({name: {$regex: args[0], $options: 'i'}}).then((player) => {
		player ?
		message.channel.send({embed:{
			color: 3553599,
			description: `Игрок: **${player.name}**\nID: **${player.uid}**\nСтоимость: **${player.price}**`,
		}})
		:
		message.channel.send('Игрок не найден.')
	})
	
	}
}