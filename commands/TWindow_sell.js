const Squad = require('../models/Squad')
const User = require('../models/User')
const editMoneyTable = require('../functions/editMoneyTable');

module.exports = {
	name: 'sell',
	description: 'Sell squad player',
	execute(message, args) {

  if (args.length !== 1) return message.channel.send(`❌ Ошибка! Принимается только 1 параметр - ID игрока.`)
		
	User.findOne({userId: message.author.id}).then((user) => {
    if (!user) return message.channel.send(`❌ Ошибка! Доступно только для менеджеров сетевой.`)
    
    let playerId = args[0]
		
		Squad.findOneAndDelete({uid: playerId}, {useFindAndModify: false}).then((player) => {

      if (!player) return message.channel.send(`❌ Ошибка! Игрока с таким ID нет в вашей команде.`)

      User.updateOne({userId: message.author.id}, {$inc: {money: player.price}}).then(() => {

        message.client.channels.cache.get(process.env.BID_CONFIRM_CHANNEL)
        .send(`✅ Игрок **${player.name}** отчислен. Получено **${player.price}** монет.`)

        editMoneyTable(message)

      })
		})
	})
	
	
	}
}