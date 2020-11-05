module.exports = {
	name: 'сооб',
	description: 'Send message as BOT in specific channel',
	execute(message, args) {

		if (message.channel.type === 'dm') {
			message.client.channels.cache.get(args[0])
				.send(`${message.content.slice(25)}`);
		} else {
			message.reply('Лучше через ЛС!')
		}
		
	}
}