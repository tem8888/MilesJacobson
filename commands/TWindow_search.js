const Transfer = require('../models/Transfer')

module.exports = {
	name: 'search',
	description: 'Search player',
	execute(message, args) {
		
	Transfer.findOne({name: {$regex: args[0], $options: 'i'}}).then((player) => {
		!player ? message.channel.send('❌ Игрок не найден.') :
		message.channel.type !== 'dm' ?
		message.channel.send(`>>> Player: **${player.name}**\nAge: **${player.age}**, CA: **${player.ca}**, PA: **${player.pa}**\nID: **${player.uid}**\nPrice: £ **${player.price}**млн`)
		:
		message.channel.send(`>>> Player: **${player.name}**, Age: **${player.age}**\nCA: **${player.ca}**, PA: **${player.pa}**\nID: **${player.uid}**\nPrice: £ **${player.price}**млн\n
_Поставьте реакцию, чтобы сделать бид. 
Каждая реакция соответствует коэффициенту увеличения ставки:  ➡️ **× 1**,   ↗️ **× 1.1**,   ⬆️ **× 1.25**,   ⏫ **× 1.5**_,   🆙 **× 2**`)
	})
	
	}
}