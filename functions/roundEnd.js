const Bid = require('../models/Bid')
const User = require('../models/User')

const roundEnd = async (round) => {

  // Все биды, сделанные в определенном раунде равны 0. Номер раунда им присваивается после завершения раунда.
  await Bid.updateMany({round: 0}, {round: round}) 

  await User.updateMany({$and: [{currentRound: round, isFinished: false}]}, {$inc: {coeff: 0.5}})

  await User.updateMany({}, {nextRound: round+1, currentRound: round})
  
}

module.exports = roundEnd