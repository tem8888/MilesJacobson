const Player = require('../models/Player')

module.exports = {
  name: 'f',
  description: 'Search player',
  execute(message, args) {
    const user = message.mentions.users.first() || message.author
    let content = message.content.slice(3)

    setTimeout(async function () {
      await message.delete()
    }, 1000)

    message.channel.send({
      embed: {
        color: 3553599,
        description: `${content}`,
        author: {
          name: `${user.username}`,
          icon_url: `${user.displayAvatarURL()}`,
        },
      },
    })
  },
}
