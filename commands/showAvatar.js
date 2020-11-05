module.exports = {
	name: 'avatar',
	description: 'Show users avatar',
	execute(message, args) {

			const user = message.mentions.users.first() || message.author
			message.channel.send({embed: {
				author: { "name": `${user.username}` },
				image: { "url": `${user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })}` }
			}})
			
	}
}