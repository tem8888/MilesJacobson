const Player = require('../models/Player')

module.exports = {
  name: 's',
  description: 'Search player',
  execute(message, args) {
    let name = args.join(' ')

    Player.findOne({ name: { $regex: name, $options: 'i' } }).then(
      (player) => {
        !player
          ? message.channel.send('❌ Игрок не найден.')
          : message.channel.type !== 'dm'
          ? message.channel.send(
              `>>> Player: **${player.name}**\nAge: **${player.age}**, CA: **${player.ca}**, PA: **${player.pa}**\nID: **${player.uid}**\nPrice: £ **${player.price}**млн`
            )
          : message.channel.send(`>>> Player: **${player.name}**, Age: **${
              player.age
            }**\nCA: **${player.ca}**, PA: **${player.pa}**\nID: **${
              player.uid
            }**\nPrice: £ **${player.price}**млн\n
Поставьте реакцию, чтобы сделать бид. 
Каждая реакция соответствует коэффициенту увеличения ставки:\n
  ➡️ **× 1** = ${player.price},   ↗️ **× 1.05** = ${Number(
              Math.round(player.price * 1.05 + 'e2') + 'e-2'
            )},   ⬆️ **× 1.1** = ${Number(
              Math.round(player.price * 1.1 + 'e2') + 'e-2'
            )},   ⏫ **× 1.2** = ${Number(
              Math.round(player.price * 1.2 + 'e2') + 'e-2'
            )},   🆙 **× 1.4** = ${Number(
              Math.round(player.price * 1.4 + 'e2') + 'e-2'
            )}`)
      }
    )
  },
}
