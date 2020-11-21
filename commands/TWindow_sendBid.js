const Bid = require('../models/Bid')
const User = require('../models/User')

module.exports = {
	name: 'bid',
	description: 'Send Bid in specific channel',
	execute(message, args) {

		if (message.channel.type !== 'dm') 
			return
		if (args.length < 2) 
			return message.channel.send(`❌ Ошибка! Запись должна содержать минимум 3 аргумента (**уникальный номер игрока**, **имя игрока**, **цена**)!`);
		if (!Number.isInteger(Number(args[args.length-1])))
			return message.channel.send(`❌ Ошибка! Неправильная запись "Цены за игрока"!`);

	//	let place = args[0]
		let price = args[args.length-1]
		let playerId = args[0]
		let player = ''

		for (let i = 1; i<args.length-1; i++)
			player += ` ${args[i]}`

		message.client.channels.cache.get(process.env.BID_SEND_CHANNEL)
			.send(`> Бид от **${message.author.tag}**! Игрок:**${player}**. Price: **${price}**`);		

		
		User.findOne({userId: message.author.id})
			.then((user) => {
				if (price > user.money) return message.channel.send(`❌ Ошибка! У вас недостаточно средств. Баланс: ${user.money}`);
				if (user.currentRound !== user.nextRound) return message.channel.send(`❌ Ошибка! Вы уже сделали бид в этом раунде.`);

				let bidData = new Bid({userId: user.userId, club: user.club, place: user.place, coeff: user.coeff, playerId: playerId, player: player.trim(), price: Number(price)})
				bidData.save((err, bid) => {
					if (err) return console.error(err);
					message.channel.send(`✅ Ваш бид на игрока **${bid.player}** принят! Возможная сумма трансфера: ${bid.price}`);

					User.findOneAndUpdate({userId: bid.userId}, {$inc: {currentRound: 1}}, {useFindAndModify: false})
						.then((data) => console.log('updated'))

				})
			}).catch((err) => {console.log(err)})
	}
}