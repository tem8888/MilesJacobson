const Squad = require('../models/Squad')
const User = require('../models/User')

module.exports = {
	name: 'team',
	description: 'Show team players',
	execute(message, args) {
		
	User.findOne({$or: [{userId: message.author.id}, {assistId: message.author.id}]}).then((user) => {
		if (!user) return message.channel.send(`❌ Ошибка! Доступно только для участников сетевой.`)
		
		Squad.find({club: user.club}).then((playerList) => {

			let players = ''
      let ids = ''
      let prices = ''
      for (player of playerList) {
        players += `**${player.name}**\n`
        ids += `${player.uid}\n`
        prices += `**${player.price}**\n`
      }

			message.channel.send({embed:{
				color: 3553599,
				title: `_ _               🛡️ ${user.club} 🛡️`,
				footer: {
      		text: `Всего игроков: ${playerList.length}`
				},
        fields: [
          {
            name: `_ _ Игрок`,
            value: `_ _\n_ _  ${players}`,
            inline: true
          },
          {
            name: `_ _ ID`,
            value: `_ _\n_ _ ${ids}`,
            inline: true
          },
          {
            name: `Стоимость, £ млн   _ _`,
            value: `_ _\n ${prices}`,
            inline: true
          },
        ],
      }})
		})
	})
	
	
	}
}