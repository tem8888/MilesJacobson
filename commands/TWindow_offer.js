const Squadlist = require('../models/Squadlist')
const User = require('../models/User')

module.exports = {
  name: 'offer',
  description: 'Transfers between managers',
  execute(message, args) {
    if (args[0] === 'exchange') {
      if (args.length !== 5)
        return message.channel.send(
          `❌ Ошибка! При обмене принимается дополнительных 4 параметров - ID своего игрока, своя доплата, ID чужого игрока, чужая доплата`
        )

      User.findOne({ userId: message.author.id }).then((user) => {
        if (!user)
          return message.channel.send(
            `❌ Ошибка! Только для менеджеров сетевой`
          )
        let playerId1 = args[1]
        let playerId2 = args[3]

        Squadlist.find({ $or: [{ uid: playerId1 }, { uid: playerId2 }] }).then(
          (players) => {
            if (players.length !== 2)
              return message.channel.send(
                `❌ Ошибка! Игроки для обмена не найдены.`
              )
            player1 = players.find((p) => playerId1 === p.uid)
            player2 = players.find((p) => playerId2 === p.uid)
            let addPrice1 = args[2]
            let addPrice2 = args[4]
            let club = player2.club
            message.client.channels.cache
              .get(process.env.BID_CONFIRM_CHANNEL)
              .send(
                `>>> _ _\n 🔄 Обмен между клубами.\n **${player1.name}** c доплатой £[${addPrice1}]млн ➡️ **[${club}]**. [${player1.uid}]\n **${player2.name}** с доплатой £[${addPrice2}]млн ➡️ **[${user.club}]**. [${player2.uid}]\n_ _`
              )

            message.channel.send(`✅ Заявка на обмен отправлена.`)
          }
        )
      })
    } else if (args[0] === 'buy') {
      if (args.length !== 3)
        return message.channel.send(
          `❌ Ошибка! При покупке принимается дополнительных 2 параметра - ID чужого игрока, сумма трансфера`
        )

      User.findOne({
        $or: [{ userId: message.author.id }, { assistId: message.author.id }],
      }).then((user) => {
        if (!user)
          return message.channel.send(`❌ Ошибка! Клубы для сделки не найдены.`)
        let playerId1 = args[1]

        Squadlist.findOne({ uid: playerId1 }).then((player) => {
          if (!player)
            return message.channel.send(
              `❌ Ошибка! Игрок для трансфера не найден.`
            )
          let addPrice1 = args[2]
          let club = player.club

          message.client.channels.cache
            .get(process.env.BID_CONFIRM_CHANNEL)
            .send(
              `>>> _ _\n 🔂 Трансфер между клубами.\n **${player.name}** [${club}] за £[${addPrice1}]млн ➡️ **[${user.club}]**. [${player.uid}]\n_ _`
            )

          message.channel.send(`✅ Заявка на трансфер отправлена.`)
        })
      })
    }
    // } else if (args[0] === 'sell') {
    //   if (args.length !== 4)
    //     return message.channel.send(
    //       `❌ Ошибка! При продаже принимается дополнительных 3 параметра - ID своего игрока, сумма трансфера, клуб-соперник,`
    //     )
    //   let club = args[3]

    //   User.find({ $or: [{ userId: message.author.id }, { club: club }] }).then(
    //     (users) => {
    //       if (users.length !== 2)
    //         return message.channel.send(
    //           `❌ Ошибка! Клубы для сделки не найдены.`
    //         )
    //       let user1 = users.find((u) => u.userId === message.author.id)
    //       let playerId1 = args[1]

    //       Squadlist.findOne({ uid: playerId1 }).then((player) => {
    //         if (!player)
    //           return message.channel.send(
    //             `❌ Ошибка! Игрок для трансфера не найден.`
    //           )
    //         let addPrice1 = args[2]

    //         message.client.channels.cache
    //           .get(process.env.BID_CONFIRM_CHANNEL)
    //           .send(
    //             `>>> _ _\n 🔂 Трансфер между клубами.\n **${player.name}** [${user1.club}] за £[${addPrice1}]млн ➡️ **[${club}]**. [${player.uid}]\n_ _`
    //           )

    //         message.channel.send(`✅ Заявка на трансфер отправлена.`)
    //       })
    //     }
    //   )
    // } else
    else
      return message.channel.send(`❌ Отсутствует параметр exchange или sell.`)
  },
}
