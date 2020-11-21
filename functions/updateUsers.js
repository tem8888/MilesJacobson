const User = require('../models/User')

const updateBids = async (round) => {

  await User.updateMany({}, {currentRound: round})
}

module.exports = updateBids