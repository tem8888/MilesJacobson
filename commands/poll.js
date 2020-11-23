const Transfer = require('../models/Transfer')

module.exports = {
	name: 'poll',
	description: 'Search player',
	execute(message, args) {

  if (!args[0]) return message.channel.send(`❌ Требуется параметр количества вариантов.`)

  let reactions = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣']
  let pollSize = args[0]
		
	message.client.channels.cache.get(process.env.POLLS_CHANNEL).send(message.content.slice(7))
		.then((msg) => {
      for (let i = 0; i < pollSize; i++) {
         msg.react(reactions[i])
      }
		})
	}
}