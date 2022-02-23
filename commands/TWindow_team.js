const Squadlist = require('../models/Squadlist')
const User = require('../models/User')

module.exports = {
  name: 'team',
  description: 'Show team players',
  execute(message, args) {
    if (args.length > 0) {
      let club = args.join(' ')
      Squadlist.find({ club: club }).then((playerList) => {
        if (playerList.length === 0)
          return message.channel.send('❌ Клуб не найден.')
        let players = ''

        for (player of playerList) {
          if (player.status === 'new') {
            players += `✘ **${player.name}** _ _ ━ _ _ ${player.uid} _ _ ━ _ _ **${player.price}**\n`
          } else {
            players += `**${player.name}** _ _ ━ _ _ ${player.uid} _ _ ━ _ _ **${player.price}**\n`
          }
        }
        message.channel.send({
          embed: {
            color: 3553599,
            title: `_ _          🛡️ ${club}`,
            footer: {
              text: `Всего игроков: ${playerList.length}`,
            },
            description: ` Игрок ━  ID ━ Стоимость, млн\n \n ${players}`,
          },
        })
      })
      return
    }

    User.findOne({
      $or: [{ userId: message.author.id }, { assistId: message.author.id }],
    }).then((user) => {
      if (!user)
        return message.channel.send(
          `❌ Ошибка! Доступно только для участников сетевой.`
        )

      Squadlist.find({ club: user.club }).then((playerList) => {
        let players = ''

        for (player of playerList) {
          if (player.status === 'new') {
            players += `✘ **${player.name}** _ _ ━ _ _ ${player.uid} _ _ ━ _ _ **${player.price}**\n`
          } else {
            players += `**${player.name}** _ _ ━ _ _ ${player.uid} _ _ ━ _ _ **${player.price}**\n`
          }
        }
        message.channel.send({
          embed: {
            color: 3553599,
            title: `_ _          🛡️ ${
              user.club
            } _ _ _ _ _ _ 💰 ${+user.money.toFixed(2)} £ млн`,
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
