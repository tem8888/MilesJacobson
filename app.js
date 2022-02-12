// Бид может делать только 1 человек, т.к. проверяется ID пользователя

const fs = require('fs')
const Discord = require('discord.js')
const mongoose = require('mongoose')
const { DiscordInteractions } = require('slash-commands')
const {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseType,
} = require('discord-interactions')
const express = require('express')
const app = express()
const client = new Discord.Client()
client.commands = new Discord.Collection()
const sendBid = require('./commands/TWindow_sendBid')
const editMoneyTable = require('./functions/editMoneyTable')
const User = require('./models/User')
const Squadlist = require('./models/Squadlist')
require('dotenv').config()
const appID = process.env.CLIENT_ID
const PREFIX = process.env.PREFIX
const guildID = process.env.GUILD_ID

// const interaction = new DiscordInteractions({
//   applicationId: appID,
//   authToken: process.env.BOT_TOKEN,
//   publicKey: process.env.PUBLIC_KEY,
// })

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.once('ready', async () => {
  console.log('Bot is ready!')
  client.user.setActivity('Football Manager 2022')

  await mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log('MongoDB connected.'))
    .catch((e) => console.log(`Error: ${e}`))
})

client.on('guildMemberAdd', (member) => {
  member.roles.add(process.env.GUEST_ROLE)
  let generalChannel = client.channels.cache.get(process.env.GUEST_CHANNEL) // Replace with known channel ID
  generalChannel.send('Приветствуем, <@' + member.user.id + '>!')
  const nmsg = member.guild.channels.cache.get(process.env.GUEST_CHANNEL)
  nmsg.send({
    embed: {
      color: 16777215,
      title: 'Правила ⇓',
      description:
        '<#502769170400673792>\n\nЕсли вы хотите остаться на сервере не только как читатель, то нам важно узнать о вас немного больше. <@750349474815017015> прислал вам сообщение в ЛС, прочтите, пожалуйста.',
      thumbnail: {
        url: 'https://media.giphy.com/media/d2r5afIHy34mWTM8r4/giphy.gif',
      },
      footer: {
        icon_url: client.user.avatarURL(),
        text: `Если вам нужна помощь, просто спросите 🙂 ${member.guild.memberCount} 🤝`,
      },
    },
  })
  let memberMsg = [
    'Приветствую в сообществе любителей Football Manager! Костяк нашего сервера состоит из участников сетевого раздела FMFan.',
    'Мы давно и хорошо знаем друг друга, но всегда рады и новым лицам. Поэтому, если вы хотите остаться на сервере не только как читатель, то нам важно узнать о вас немного больше. Для этого необходимо заполнить анкету и отправить ее мне.',
    '\n**ВАЖНО!** Отсылать надо всю анкету **одним сообщением** в том формате, в котором она приведена ниже вместе с командой **"!анкета"** в первой строчке. Если анкета дошла до администраторов, то я сразу отпишу.',
    'Все строки отмеченные **+** обязательны к заполнению.\n',
    '>>> !анкета',
    '**+** Ник на FMFan: __*(если такого нет, то придется создать аккаунт)*__',
    '**+** Имя: __*(ваше настоящее имя)*__',
    '**+** Дата рождения: __*(число, месяц и год)*__',
    '**+** Город: __*(город в котором проживаете)*__',
    '**+** Опыт игры в Football Manager: __*(в какие части FM играли)*__',
    'VK: __*(ссылка на ваш профиль по желанию)*__',
    'Дополнительная информация о себе: __*(за какой клуб болеете, чем занимаетесь и тому подобное)*__',
  ]
  member.send(memberMsg)
})

// client.on('guildMemberRemove', (member) => {
//   let generalChannel = client.channels.cache.get(process.env.GUEST_CHANNEL); // Replace with known channel ID
//   generalChannel.send("Прощаемся с <@" + member.user.id + ">!");
//  });

client.on('messageReactionAdd', async (reaction, user) => {
  let message = reaction.message,
    emoji = reaction.emoji

  // Подтверждение трансфера между менеджерами
  if (
    emoji.name == '✅' &&
    message.channel.id === process.env.TRANSFERS_CHANNEL &&
    emoji.reaction.count === 1
  ) {
    let reBrackets = /\[(.*?)\]/g
    let changeInfo = []
    let found = ''
    while ((found = reBrackets.exec(message.content))) {
      changeInfo.push(found[1])
    }

    if (changeInfo.length === 6) {
      // Правки для обмена и покупки
      await User.findOneAndUpdate(
        // обновляем баланс
        { club: changeInfo[4] },
        { $inc: { money: Number(changeInfo[3]) - Number(changeInfo[0]) } },
        { useFindAndModify: false }
      )
      await User.findOneAndUpdate(
        { club: changeInfo[1] },
        { $inc: { money: Number(changeInfo[0]) - Number(changeInfo[3]) } },
        { useFindAndModify: false }
      )
      // меняем у игрока клубы местами
      await Squadlist.findOneAndUpdate(
        { uid: changeInfo[2] },
        { club: changeInfo[1], mins: 0 },
        { useFindAndModify: false }
      )
      await Squadlist.findOneAndUpdate(
        { uid: changeInfo[5] },
        { club: changeInfo[4], mins: 0 },
        { useFindAndModify: false }
      )
    } else if (changeInfo.length === 4) {
      // Правки для продажи
      await User.findOneAndUpdate(
        // обновляем баланс продающего
        { club: changeInfo[0] },
        { $inc: { money: Number(changeInfo[1]), players: -1 } },
        { useFindAndModify: false }
      )
      await User.findOneAndUpdate(
        // обновляем баланс покупающего
        { club: changeInfo[2] },
        { $inc: { money: -Number(changeInfo[1]), players: 1 } },
        { useFindAndModify: false }
      )
      // меняем клуб у игрока
      await Squadlist.findOneAndUpdate(
        { uid: changeInfo[3] },
        { club: changeInfo[2], status: 'new' },
        { useFindAndModify: false }
      )
    }
    editMoneyTable(message) // редактируем бюджет в дискорд-канале
  }

  if (message.channel.type !== 'dm') return
  let bidmsg = message.content.split('\n')
  if (bidmsg.length !== 9) return // Дальнейшие проверки только если реакция была проставлена под результатом поиска
  // Создание бида на основе результата поиска !search player
  if (emoji.name == '➡️') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      bidmsg[3].slice(11, -5),
      user.id,
      user.username,
    ])
  } else if (emoji.name == '↗️') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      Number(Math.round(Number(bidmsg[3].slice(11, -5)) * 1.05 + 'e2') + 'e-2'),
      user.id,
      user.username,
    ])
  } else if (emoji.name == '⬆️') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      Number(Math.round(Number(bidmsg[3].slice(11, -5)) * 1.1 + 'e2') + 'e-2'),
      user.id,
      user.username,
    ])
  } else if (emoji.name == '⏫') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      Number(Math.round(Number(bidmsg[3].slice(11, -5)) * 1.2 + 'e2') + 'e-2'),
      user.id,
      user.username,
    ])
  } else if (emoji.name == '🆙') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      Number(Math.round(Number(bidmsg[3].slice(11, -5)) * 1.4 + 'e2') + 'e-2'),
      user.id,
      user.username,
    ])
  }
})

client.on('message', (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return

  const args = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/\n+| +/)
  const commandName = args.shift().toLowerCase()

  if (!client.commands.has(commandName)) return
  const command = client.commands.get(commandName)

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('Ошибка при запуске команды!')
  }
})

//client.ws.on('INTERACTION_CREATE', async (interaction) => {
//console.log(interaction)
// app.post(`/applications/${appID}/commands`, verifyKeyMiddleware('e55015414053bff3bf102c38c06244cb8869a7eb67a62fc836ab12ecbf6167ac'), (req, res) => {
//   const message = req.body;

//   console.log(message.type)
//  console.log(InteractionType.COMMAND)
//   if (message.type === InteractionType.COMMAND) {
//     console.log('WORK')
//     res.send({
//       type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//       data: {
//         content: clubs,
//         embeds: [clubsEmbed]
//       },
//     });
//   }
// });
// console.log(interaction)
// console.log(interaction.data.options[0].value)
// if (interaction.data.name === 'clubs') {
//   client.api.interactions(interaction.id, interaction.token).callback.post({
//     data: {
//       type: 4,
//       data: {
//         content: '',
//         embeds: [clubsEmbed],
//       },
//     },
//   })
// }
//})

client.login(process.env.BOT_TOKEN)
