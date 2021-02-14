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
const Squad = require('./models/Squad')
require('dotenv').config()
const appID = process.env.CLIENT_ID
const PREFIX = process.env.PREFIX
const guildID = process.env.GUILD_ID

const interaction = new DiscordInteractions({
  applicationId: appID,
  authToken: process.env.BOT_TOKEN,
  publicKey: process.env.PUBLIC_KEY,
})

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.once('ready', async () => {
  console.log('Bot is ready!')
  client.user.setActivity('Cyberpunk 2077')

  // client.api
  //   .applications(appID)
  //   .guilds(guildID)
  //   .commands.post({
  //     data: {
  //       name: 'clubs',
  //       description: 'Список всех участников сетевой',
  //     },
  //   })

  // client.api
  //   .applications(appID)
  //   .guilds(guildID)
  //   .commands.get()
  //   .then((cmds) => console.log(cmds))
  // client.api.applications(appID).guilds(guildID).commands("791741531459289128").delete().then(() => console.log("deleted"))
  //client.api.applications(appID).guilds(guildID).commands("792215262636015637").delete().then(() => console.log("deleted"))

  //  Get Guild Commands
  // await interaction
  // .getApplicationCommands(guildID)
  // .then((cmds) => console.log(cmds))
  // .catch(console.error);

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
  generalChannel.send('Добро пожаловать, <@' + member.user.id + '>!')
  const nmsg = member.guild.channels.cache.get(process.env.GUEST_CHANNEL)
  nmsg.send({
    embed: {
      color: 16777215,
      title: 'Правила ⇓',
      description:
        '<#502769170400673792>\n\nЕсли вы хотите остаться на сервере не только как читатель, то нам важно узнать о вас немного больше. <@371973105884856331> прислал вам сообщение в ЛС, прочтите, пожалуйста.',
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
      await Squad.findOneAndUpdate(
        { uid: changeInfo[2] },
        { club: changeInfo[1], mins: 0 },
        { useFindAndModify: false }
      )
      await Squad.findOneAndUpdate(
        { uid: changeInfo[5] },
        { club: changeInfo[4], mins: 0 },
        { useFindAndModify: false }
      )
    } else if (changeInfo.length === 4) {
      // Правки для продажи
      await User.findOneAndUpdate(
        // обновляем баланс продающего
        { club: changeInfo[0] },
        { $inc: { money: Number(changeInfo[1]) } },
        { useFindAndModify: false }
      )
      await User.findOneAndUpdate(
        // обновляем баланс покупающего
        { club: changeInfo[2] },
        { $inc: { money: -Number(changeInfo[1]) } },
        { useFindAndModify: false }
      )
      // меняем клуб у игрока
      await Squad.findOneAndUpdate(
        { uid: changeInfo[3] },
        { club: changeInfo[2], mins: 0 },
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
      Number(Math.round((Number(bidmsg[3].slice(11, -5)) * 1.05) + 'e2') + 'e-2'),
      user.id,
      user.username,
    ])
  } else if (emoji.name == '⬆️') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      Number(Math.round((Number(bidmsg[3].slice(11, -5)) * 1.1) + 'e2') + 'e-2'),
      user.id,
      user.username,
    ])
  } else if (emoji.name == '⏫') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      Number(Math.round((Number(bidmsg[3].slice(11, -5)) * 1.2) + 'e2') + 'e-2'),
      user.id,
      user.username,
    ])
  } else if (emoji.name == '🆙') {
    sendBid.execute(message, [
      bidmsg[2].slice(6, -2),
      Number(Math.round((Number(bidmsg[3].slice(11, -5)) * 1.4) + 'e2') + 'e-2'),
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

const clubsEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Клубы и участники сетевой')
  .setURL('https://discord.js.org/')
  .setAuthor(
    'СЕТЕВАЯ БРИТАНИЯ 2021',
    'https://i.imgur.com/wSTFkRM.png',
    'https://discord.js.org'
  )
  .setThumbnail('https://i.imgur.com/wSTFkRM.png')
  .addFields(
    {
      name: 'Клуб',
      value: `<:blackb:788128062763958352> Blackburn
    <:clBlackpool:788132421844467723> Blackpool
    <:clCharlton:788449223796195379> Charlton
    <:clCork:787462185625845790> Cork
    <:clCrewe:788453149249110058> Crewe
    <:clDundee:788439059604439070> Dundee
    <:clDundeeU:788434818437218326> Dundee United
    <:clIpswich:787421399714365470> Ipswich
    <:clKilmarnock:788401253205278741> Kilmarnock
    <:clBoro:788434937618497536> Middlesbrough
    <:clNomads:788459617897414656> Connah's Quay
    <:clForest:787418118027739137> Nottingham Forest\u00A0\u00A0\u00A0
    <:clOxford:787800122251149392> Oxford United
    <:clPartick:788121883371372594> Partick Thistle
    <:clPortsmouth:787772178732154910> Portsmouth
    <:clSheffW:788406878715117608> Sheffield Wed
    <:clSunderland:787447964079489064> Sunderland
    <:clSwindon:787780499900727346> Swindon Town`,
      inline: true,
    },
    {
      name: 'Менеджер [ассистент]',
      value:
        ':england: maximko\n:england: hooligan4ik\n:england: al necheporenko\n:flag_ie: monkey-d-lufffy\n:england: Роман\n:scotland: tem\n:scotland: Criomar\n:england: plasteelin [E6ison]\n:scotland: Dragovic1982\n:england: Igor\n:wales: piggy [Ilya]\n:england: Arisen\n:england: Alxun\n:scotland: Karsoris [Ez]\n:england: AstraDelic\n:england: sashanik\n:england: YurDav\n:england: SMS',
      inline: true,
    }
  )

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
