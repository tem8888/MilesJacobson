const Bid = require('../models/Bid')
const User = require('../models/User')
const Transfer = require('../models/Transfer')

module.exports = {
  name: 'reset',
  description: 'Reset all rounds, delete all bids',
  execute(message, args = null) {
    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send(`❌ Недостаточно прав.`)

    Bid.deleteMany({}).then(() => message.channel.send(`✅ Биды удалены.`))
    User.updateMany(
      {},
      { currentRound: 0, nextRound: 1, coeff: 1, isFinished: false }
    ).then(() => message.channel.send(`✅ Раунды сброшены.`))
    Transfer.updateMany({}, { status: '' }).then(() => null)
  },
}
