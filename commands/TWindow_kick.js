const Squad = require('../models/Squad')
const User = require('../models/User')
const editMoneyTable = require('../functions/editMoneyTable')

module.exports = {
  name: 'kick',
  description: 'Kick squad player',
  execute(message, args) {
    if (args.length !== 1)
      return message.channel.send(
        `❌ Ошибка! Принимается только 1 параметр - ID игрока.`
      )

    User.findOne({
      $or: [{ userId: message.author.id }, { assistId: message.author.id }],
    }).then((user) => {
      if (!user)
        return message.channel.send(
          `❌ Ошибка! Доступно только для участников сетевой.`
        )
      if (user.players <= 18)
        return message.channel.send(
          `❌ Ошибка! В составе должно оставаться минимум 18 игроков.`
        )

      let playerId = args[0]

      Squad.findOneAndDelete(
        { uid: playerId },
        { useFindAndModify: false }
      ).then((player) => {
        if (!player)
          return message.channel.send(
            `❌ Ошибка! Игрока с таким ID нет в вашей команде.`
          )
        if (player.status === 'new')
          return message.channel.send(
            `❌ Ошибка! **${player.name}** нельзя отчислить в этом сезоне.`
          )

        User.updateOne(
          {
            $or: [
              { userId: message.author.id },
              { assistId: message.author.id },
            ],
          },
          { 
            $inc: { 
              money: Number(Math.round(player.value + 'e2') + 'e-2'),
              players: -1  
            } 
          } 
        ).then(() => {
          message.channel.send(`${player.name} отчислен. Получите £**${player.value}** млн, распишитесь.`)
          message.client.channels.cache
            .get(process.env.BID_CONFIRM_CHANNEL)
            .send(
              `✅ Игрок **${player.name}** отчислен из клуба ${user.club}. Получено £**${player.value}** млн.`
            )

          editMoneyTable(message)
        })
      })
    })
  },
}
