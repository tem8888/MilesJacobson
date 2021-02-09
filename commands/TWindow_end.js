const User = require('../models/User')
const Squads = require('../models/Squad')

module.exports = {
  name: 'end',
  description: 'Transfer Window ending',
  execute(message, args) {
    // User.findOneAndUpdate({userId: message.author.id},{isFinished: true},{useFindAndModify: false}).then(() => {
    // 	message.channel.send('✅ Клуб ${user.club} завершил трансферное окно.')
    // })

    User.findOne({
      $or: [{ userId: message.author.id }, { assistId: message.author.id }],
    }).then((user) => {
      Squads.find({ club: user.club }).then((playerList) => {
        if (playerList.length < 18)
          return message.channel.send(
            '❌ Ошибка! Для завершения ТО у вас должно быть не менее 18 игроков в составе.'
          )
        User.findOneAndUpdate({
          $or: [{ userId: message.author.id }, { assistId: message.author.id }],
        }).then(() => {
          message.channel.send(
            '✅ Клуб ${user.club} завершил трансферное окно.'
          )
        })
      })
    })
  },
}
