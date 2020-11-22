const Bid = require('../models/Bid')
const User = require('../models/User')
const Transfer = require('../models/Transfer')
const uids = require('../data/uids')

module.exports = {
	name: 'bid',
	description: 'Send Bid in specific channel',
	execute(message, args) {

		if (message.channel.type !== 'dm') 
			return
		if (args.length !== 2) 
			return message.channel.send(`❌ Ошибка! Запись должна содержать 2 аргумента (**уникальный номер игрока**, **цена**)!`);
		if (!Number.isInteger(Number(args[args.length-1])) || Number(args[args.length-1]) < 0)
			return message.channel.send(`❌ Ошибка! Неправильная запись цены за игрока.`);
		
		let playerId = args[0]
		let price = Number(args[args.length-1])
	//	let player = ''
	//	for (let i = 1; i<args.length-1; i++) // Собираем имя игрока из несколькольких слов в одну строку
	//		player += ` ${args[i]}`
		
		Transfer.findOne({uid: playerId}).then((transfer) => {  // Проверка на доступность к трансферу
				if (!transfer) {
					return message.channel.send(`❌ Ошибка! Игрока с таким ID в базе нет.`);
				} else if (transfer.status === 'finished') {
					return message.channel.send(`❌ Ошибка! Игрок таким ID уже продан.`)
				} else if (Number(transfer.price) > price) { 
					return message.channel.send(`❌ Ошибка! Минимальная цена за ${transfer.name} составляет ${transfer.price}.`)
				} else {
					User.findOne({userId: message.author.id}) // Если игрок не был продан и такой ID существует, то принимаем бид
						.then((user) => {
							if (price > user.money) return message.channel.send(`❌ Ошибка! У вас недостаточно средств. Баланс: ${user.money}`);
							if (user.currentRound > user.nextRound) return message.channel.send(`❌ Ошибка! Вы уже сделали бид в этом раунде.`);
							if (user.currentRound < user.nextRound) return message.channel.send(`❌ Ошибка! Следующий раунд еще не начался.`);

							message.client.channels.cache.get(process.env.BID_SEND_CHANNEL)
								.send(`> Бид от **${message.author.tag}**! Игрок:**${transfer.name}** (id: ${playerId}). Price: **${price}**`);		

							let bidData = new Bid({userId: user.userId, club: user.club, place: user.place, coeff: user.coeff, playerId: playerId, player: transfer.name, price: Number(price)})
							bidData.save((err, bid) => {
								if (err) return console.error(err);
								message.channel.send(`✅ Ваш бид на игрока **${bid.player}** (id: ${bid.playerId}) принят! Возможная сумма трансфера: ${bid.price}`);
								User.updateOne({userId: bid.userId}, {$inc: {currentRound: 1}}).then(() => null)
							})
						}).catch((err) => {console.log(err)})
				}
			})
	}
}