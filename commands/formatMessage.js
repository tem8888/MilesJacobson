module.exports = {
  name: 'format',
  description: 'Format message in embed',
  execute(message, args) {
    formatMessage = message.content.slice(2).split('|')

    let msg = ' ▸ ' + formatMessage[1] + ' ◂ '
    let title = ' ' + formatMessage[0] + ' '

    while (msg.length < 70) {
      msg = [' ▸ ', msg, ' ◂ '].join('')
    }

    setTimeout(async function () {
      await message.delete()
    }, 2000)
    message.channel.send({
      embed: {
        color: 3553599,
        title: `_ _${title}_ _\n`,
        description: `_ _\n[${msg.toUpperCase()}](${
          formatMessage[2]
        })\n_ _\n${formatMessage[4].trim()}`,
        thumbnail: {
          url: `${formatMessage[3].trim()}`,
        },
      },
    })
  },
}
