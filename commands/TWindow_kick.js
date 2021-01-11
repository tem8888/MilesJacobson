const Squad = require('../models/Squad')
const User = require('../models/User')
const editMoneyTable = require('../functions/editMoneyTable');

module.exports = {
	name: 'kick',
	description: 'Kick squad player',
	execute(message, args) {

  if (args.length !== 1) return message.channel.send(`❌ Ошибка! Принимается только 1 параметр - ID игрока.`)
		
	User.findOne({$or: [{userId: message.author.id}, {assistId: message.author.id}]}).then((user) => {
    if (!user) return message.channel.send(`❌ Ошибка! Доступно только для участников сетевой.`)
    
    let playerId = args[0]
		
		Squad.findOneAndDelete({uid: playerId}, {useFindAndModify: false}).then((player) => {

      if (!player) return message.channel.send(`❌ Ошибка! Игрока с таким ID нет в вашей команде.`)
      // Squad.find({club: user.club}).then((playerList) => {
      //   if (playerList.length <= 18) return message.channel.send(`❌ Ошибка! В команде не может быть менее 18 игроков`)
      // })

      User.updateOne({$or: [{userId: message.author.id}, {assistId: message.author.id}]}, {$inc: {money: player.price}}).then(() => {

        message.client.channels.cache.get(process.env.BID_CONFIRM_CHANNEL)
        .send(`✅ Игрок **${player.name}** отчислен из клуба ${user.club}. Получено £**${player.price}** млн.`)

        editMoneyTable(message)

      })
		})
	})
	
	
	}
}