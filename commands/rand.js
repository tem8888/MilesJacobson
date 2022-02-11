const Player = require('../models/Player')

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

module.exports = {
  name: 'rand',
  description: 'Search player',
  async execute(message, args) {
    if (args.length === 0)
      return message.channel.send(`❌ Требуются 2 параметра.`)

    let mesSend
    let timer = 8

    if (message.member.hasPermission('MANAGE_MESSAGES')) {
      let mesEdit = `>>> _ _\n 🔄 ------------- 🔄 [00:0${timer}]\n _ _`
      mesSend = await message.channel.send(mesEdit)

      let interval = setInterval(function () {
        mesSend.edit(
          `>>> _ _\n 🔄 ${args[getRandomInt(2)]} 🔄 [00:0${timer - 1}]\n _ _`
        )
        timer -= 1
      }, 1500)
      setTimeout(function () {
        clearInterval(interval)
        mesSend.edit(`>>> _ _\n ✅ ${args[getRandomInt(2)]} ✅\n _ _`)
      }, 12000)
    } else {
      message.channel.send('Недостаточно прав.')
    }
  },
}
