const Bid = require('../models/Bid')
const User = require('../models/User')

const updateBids = async (round) => {

  // Все биды, сделанные в определенном раунде равны 0. Номер раунда им присваивается после завершения раунда.
  await Bid.updateMany({round: 0}, {round: round}) 
  await User.updateMany({}, {$inc: {nextRound: round}})
}

module.exports = updateBids