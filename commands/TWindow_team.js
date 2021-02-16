const Squad = require('../models/Squad')
const User = require('../models/User')

module.exports = {
  name: 'team',
  description: 'Show team players',
  execute(message, args) {
    User.findOne({
      $or: [{ userId: message.author.id }, { assistId: message.author.id }],
    }).then((user) => {
      if (!user)
        return message.channel.send(
          `❌ Ошибка! Доступно только для участников сетевой.`
        )

      Squad.find({ club: user.club }).then((playerList) => {
        let players = ''

        for (player of playerList) {
          if (player.status === 'new') {
            players += `✘ **${player.name}** _ _ ━ _ _ ${player.uid} _ _ ━ _ _ **${player.value}**\n`
          } else {
            players += `**${player.name}** _ _ ━ _ _ ${player.uid} _ _ ━ _ _ **${player.value}**\n`
          }
          
        }
        message.channel.send({
          embed: {
            color: 3553599,
            title: `_ _          🛡️ ${user.club} _ _ _ _ _ _ 💰 ${+user.money.toFixed(2)} £ млн`,
            footer: {
              text: `Всего игроков: ${playerList.length}`,
            },
            description: `_ _        Игрок        ━        ID        ━        Стоимость, млн\n \n ${players}`,
          },
        })
      })
    })
  },
}
