const User = require('../models/User')
let statsMessageTable = null

const editMoneyTable = (message) => {
  User.find({ }) // Получаем список клубов с измененными балансами
    .then( async (userList) => { 
      let clubs = ''
      let money = ''
      let users = ''
      for (user of userList) {
        clubs += `**${user.club}**\n▔▔▔▔▔▔▔▔\n`
        users += `**${user.username}**\n▔▔▔▔▔▔▔▔\n`
        money += `**${user.money}**\n▔▔▔▔\n`
      }

      let embedMsg = {embed:{
        color: 3553599,
        fields: [
          {
            name: `_ _ 👨‍💻 Менеджер`,
            value: `_ _\n_ _ ${users}`,
            inline: true
          },
          {
            name: `_ _ 🛡️ Клуб`,
            value: `_ _\n_ _ ${clubs}`,
            inline: true
          },
          {
            name: `💰 Бюджет   _ _`,
            value: `_ _\n_ _  ${money}`,
            inline: true
          },
        ],
      }}

      if (statsMessageTable) {
        await statsMessageTable.edit(embedMsg)
      } else {
        try {
          message.client.channels.cache.get(process.env.MONEY_STAT_CHANNEL).bulkDelete(1)
        } finally {
          statsMessageTable = await message.client.channels.cache.get(process.env.MONEY_STAT_CHANNEL).send(embedMsg);
        } 
      }    
    })
    .catch((error) => { console.log('error: ', error) })
}

module.exports = editMoneyTable