const sendWinnersMessages = (bidWinnersList, message) => {
  let bidCount = 0
  if (bidWinnersList === undefined) return

  let interval = setInterval(async function () {

    if (bidWinnersList[bidCount].hasOwnProperty('losers')) { // если есть лузера
      let losers = ''
      for (los of bidWinnersList[bidCount].losers) {
        losers += `-✘- *${los.club} (£${los.price} млн)* `
      }
      descr = `✅ Клуб **${bidWinnersList[bidCount].club}** завершил сделку по игроку **${bidWinnersList[bidCount].player}**.\n💷 Сумма трансфера: £**${bidWinnersList[bidCount].price}**млн\n ${losers}`
      message.client.channels.cache.get(process.env.BID_CONFIRM_CHANNEL).send({
        embed: {
          color: 3553599,
          description: descr,
        },
      })
    } else { // если нет лузеров
      descr = `✅ Клуб **${bidWinnersList[bidCount].club}** завершил сделку по игроку **${bidWinnersList[bidCount].player}**.\n💷 Сумма трансфера: £**${bidWinnersList[bidCount].price}**млн`,
      message.client.channels.cache.get(process.env.BID_CONFIRM_CHANNEL).send({
        embed: {
          color: 3553599,
          description: descr,
        }
      })
    }
    bidCount += 1
  }, 2000)

  setTimeout(async function () {
    clearInterval(interval)
  }, 2000 * (bidWinnersList.length + 1))
}

module.exports = sendWinnersMessages
