const sendWinnersMessages = (bidWinnersList, message) => {
  let bidCount = 0
  let interval = setInterval(async function () {
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
