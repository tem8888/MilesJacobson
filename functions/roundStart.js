const User = require('../models/User')

const roundStart = async (round) => {

 // await User.updateMany({}, {currentRound: round})
 //round !== 1 ? 
 await User.updateMany({}, {currentRound: round})

}

module.exports = roundStart