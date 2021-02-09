const Bid = require('../models/Bid')
const User = require('../models/User')
const Transfer = require('../models/Transfer')

module.exports = {
  name: 'bid',
  description: 'Send Bid in specific channel',
  execute(message, args) {
    if (message.channel.type !== 'dm') return
    if (args.length !== 2 && !message.author.bot)
      return message.channel.send(
        `❌ Ошибка! Запись должна содержать 2 аргумента (**уникальный номер игрока**, **цена**)!`
      )
    if (
      (!Number.isInteger(Number(args[args.length - 1])) ||
        Number(args[args.length - 1]) < 0) &&
      !message.author.bot
    )
      return message.channel.send(
        `❌ Ошибка! Неправильная запись цены за игрока.`
      )

    let playerId = args[0]
    let price = args[1]
    let userId = '',
      username = ''
    if (message.author.bot) {
      ;(userId = args[2]), (username = args[3])
    } // если бид был сделан через бота, то определяем доп параметры

    Transfer.findOne({ uid: playerId }).then((transfer) => {
      // Проверка на доступность к трансферу
      if (!transfer) {
        return message.channel.send(`❌ Ошибка! Игрока с таким ID в базе нет.`)
      } else if (transfer.status === 'finished') {
        return message.channel.send(`❌ Ошибка! Игрок таким ID уже продан.`)
      } else if (Number(transfer.price) > price) {
        return message.channel.send(
          `❌ Ошибка! Минимальная цена за ${transfer.name} составляет ${transfer.price}.`
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
            if (user.currentRound > user.nextRound)
              return message.channel.send(
                `❌ Ошибка! Вы уже сделали бид в этом раунде.`
              )
            if (user.currentRound < user.nextRound)
              return message.channel.send(
                `❌ Ошибка! Следующий раунд еще не начался.`
              )
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
                  transfer.name
                }** (id: ${playerId}). Ставка: £**${price}**млн`
              )

            let bidData = new Bid({
              userId: user.userId,
              club: user.club,
              place: user.place,
              coeff: user.coeff,
              playerId: playerId,
              player: transfer.name,
              price: price,
            })
            bidData.save((err, bid) => {
              if (err) return console.error(err)
              message.channel.send(
                `✅ Бид на игрока **${bid.player}** (id: ${bid.playerId}) принят! Возможная сумма трансфера: £**${bid.price}**млн. Ожидайте конца раунда.`
              )
              User.updateOne(
                { userId: bid.userId },
                { $inc: { currentRound: 1 } }
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
