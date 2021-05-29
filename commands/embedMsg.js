const axios = require('axios')

module.exports = {
  name: 'gg',
  description: 'Embed Msg',
  execute(message, args = null) {
    let cont = message.content.slice(3).split('|')
    let Attachment = message.attachments.array()
    let img_url = ''
    if (Attachment != '') img_url = Attachment[0].url
    if (cont.length === 4) {
      message.client.channels.cache.get(process.env.GG_RESULT_CHANNEL).send({
        embed: {
          title: `_ _              _ _               ${cont[0]}`,
          color: 3553599,
          thumbnail: {
            url: `${img_url}`,
          },
          fields: [
            {
              name: `ИЗ`,
              value: `${cont[1]}\n▔▔▔▔▔▔▔▔▔▔`,
              inline: true,
            },
            {
              name: `В`,
              value: `**${cont[2]}**\n▔▔▔▔▔▔▔▔▔▔`,
              inline: true,
            },
            {
              name: `ЗА`,
              value: `${cont[3]}`,
              inline: true,
            },
          ],
        },
      })
    } else {
      message.client.channels.cache.get(resultChannel).send({
        embed: {
          color: 3553599,
          description: `${cont}`,
          thumbnail: {
            url: `${img_url}`,
          },
        },
      })
    }
  },
}
