const Squadlist = require('../models/Squadlist')
const User = require('../models/User')
const editMoneyTable = require('../functions/editMoneyTable')

module.exports = {
  name: 'kick',
  description: 'Kick Squadlist player',
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

      Squadlist.findOneAndDelete(
        { uid: playerId, status: { $not: { $regex: 'new' } }, club: user.club },
        { useFindAndModify: false }
      ).then((player) => {
        if (!player)
          return message.channel.send(
            `❌ Ошибка! Вы не можете отчислить игрока с таким ID.`
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
              money: Number(Math.round(player.price + 'e2') + 'e-2'),
              players: -1,
            },
          }
        ).then(() => {
          message.channel.send(
            `${player.name} отчислен. Получите £**${player.price}** млн, распишитесь.`
          )
          message.client.channels.cache
            .get(process.env.BID_CONFIRM_CHANNEL)
            .send(
              `✅ Игрок **${player.name}** отчислен из клуба ${user.club}. Получено £**${player.price}** млн.`
            )

          editMoneyTable(message)
        })
      })
    })
  },
}
