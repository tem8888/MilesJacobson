const Bid = require('../models/Bid')
const User = require('../models/User')
const Player = require('../models/Player')

module.exports = {
  name: 'bid',
  description: 'Send Bid in specific channel',
  execute(message, args) {
    if (message.channel.type !== 'dm') return

    if (args.length === 1 && args[0] === 'cancel' && !message.author.bot) {
      Bid.findOneAndDelete(
        {
          // Ищем сделанный бид конкретным пользователем на игрока в текущем раунде (раунд в Bid обновляется только после его завершения)
          $and: [{ userId: message.author.id }, { round: 0 }],
        },
        function (err, docs) {
          if (err) {
            console.log(err)
          } else {
            if (!docs) message.channel.send(`❌ Такой бид вы не делали.`)
            // Если бид не найден
            else {
              // если бид найден и удален, обновляем счетчик раундов пользователя
              User.updateOne(
                {
                  $or: [
                    { userId: message.author.id },
                    { assistId: message.author.id },
                  ],
                },
               // { $inc: { currentRound: -1 } }
               { $set: { bidStatus: 'open' } }
              ).then(() => {
                message.client.channels.cache
                  .get(process.env.BID_SEND_CHANNEL)
                  .send(
                    `> **${message.author.tag}** отменил бид на **${docs.player}** (id: ${docs.playerId}).`
                  )
              })
              message.channel.send(
                `☑️ Бид на **${docs.player}** (id: ${docs.playerId}) отменен.`
              )
            }
          }
        }
      )
      return
    }

    if (args.length !== 2 && !message.author.bot)
      return message.channel.send(
        `❌ Ошибка! Чтобы сделать бид, запись должна содержать 2 аргумента (**уникальный номер игрока**, **цена**)!`
      )

    if (
      (isNaN(Number(args[args.length - 1])) ||
        Number(args[args.length - 1]) < 0) &&
      !message.author.bot
    ) {
      return message.channel.send(
        '❌ Ошибка! Неправильная запись цены за игрока. Разделитель дробной части - точка ` . `'
      )
    }

    if (!message.author.bot) {
      let fractNum = args[args.length - 1].split('.')
      if (fractNum[fractNum.length - 1].length > 2) {
        return message.channel.send(
          '❌ Ошибка! Допускается только 2 знака после запятой (точки)'
        )
      }
    }

    let playerId = args[0]
    let price = args[1]
    let userId = ''
    let username = ''
    if (message.author.bot) {
      userId = args[2]
      username = args[3]
    } // если бид был сделан через бота, то определяем доп параметры

    Player.findOne({ uid: playerId }).then((Player) => {
      // Проверка на доступность к трансферу
      if (!Player) {
        return message.channel.send(`❌ Ошибка! Игрока с таким ID в базе нет.`)
      } else if (Player.status === 'done') {
        return message.channel.send(`❌ Ошибка! Игрок таким ID уже продан.`)
      } else if (Number(Player.price) > price) {
        return message.channel.send(
          `❌ Ошибка! Минимальная цена за ${Player.name} составляет ${Player.price}.`
        )
      } else {
        User.findOne({
          $or: [
            // Если игрок не был продан и такой ID существует, то принимаем бид
            { userId: !userId ? message.author.id : (checkAss = userId) },
            { assistId: !userId ? message.author.id : (checkAss = userId) },
          ],
        })
          .then((user) => {
            if (!user)
              return message.channel.send(
                `❌ Ошибка! Только для участников сетевой.`
              ) // только для участников сетевой
            if (user.currentRound === 0)
              return message.channel.send(
                `❌ Ошибка! Трансферное окно еще закрыто.`
              )
            if (user.bidStatus === 'closed')
              return message.channel.send(
                `❌ Ошибка! Вы уже сделали бид в этом раунде или новый раунд еще не стартовал.`
              )
            // if (user.currentRound > user.nextRound)
            //   return message.channel.send(
            //     `❌ Ошибка! Вы уже сделали бид в этом раунде.`
            //   )
            // if (user.currentRound < user.nextRound)
            //   return message.channel.send(
            //     `❌ Ошибка! Следующий раунд еще не начался.`
            //   )
            if (price > user.money)
              return message.channel.send(
                `❌ Ошибка! У вас недостаточно средств. Баланс: ${user.money}`
              )

            message.client.channels.cache
              .get(process.env.BID_SEND_CHANNEL)
              .send(
                `> Бид от **${!username ? message.author.tag : username}** (${
                  user.club
                }). Игрок: **${
                  Player.name
                }** (id: ${playerId}). Ставка: £**${price}**млн`
              )

            let bidData = new Bid({
              userId: user.userId,
              club: user.club,
              place: user.place,
              coeff: user.coeff,
              playerId: playerId,
              player: Player.name,
              price: price,
            })
            bidData.save((err, bid) => {
              if (err) return console.error(err)
              message.channel.send(
                `✅ Бид на игрока **${bid.player}** (id: ${bid.playerId}) принят! Возможная сумма трансфера: £**${bid.price}**млн. Ожидайте конца раунда.`
              )
              User.updateOne(
                { userId: bid.userId },
              //  { $inc: { currentRound: 1 } }
              { $set: { bidStatus: 'closed' } }
              ).then(() => null)
            })
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
  },
}
