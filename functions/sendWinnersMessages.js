const sendWinnersMessages = (bidWinnersList, message) => {
  let bidCount = 0
  let interval = setInterval(async function () {

    // if (bidWinnersList[bidCount].losers.length !== 0 || bidWinnersList[bidCount].losers === undefined) { // если есть лузера
    //   for (los of bidWinnersList[bidCount].losers) {
    //     losers += `${los.club} (£${los.price} млн)\n `
    //   }
    //   descr = `✅ Клуб **${bidWinnersList[bidCount].club}** завершил сделку по игроку **${bidWinnersList[bidCount].player}**.\n💷 Сумма трансфера: £**${bidWinnersList[bidCount].price}**млн\n ${losers}`
    // } else { // если нет лузеров
    // }

    message.client.channels.cache.get(process.env.BID_CONFIRM_CHANNEL).send({
      embed: {
        color: 3553599,
        description: `✅ Клуб **${bidWinnersList[bidCount].club}** завершил сделку по игроку **${bidWinnersList[bidCount].player}**.\n💷 Сумма трансфера: £**${bidWinnersList[bidCount].price}**млн`,
      },
    })
    bidCount += 1
  }, 2000)

  setTimeout(async function () {
    clearInterval(interval)
  }, 2000 * (bidWinnersList.length + 1))
}

module.exports = sendWinnersMessages
