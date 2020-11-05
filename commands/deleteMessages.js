module.exports = {
	name: 'del',
	description: 'Delete last messages',
	execute(message, args) {

		if (message.member.hasPermission("MANAGE_MESSAGES")) {
			let amount = args[0] || 10
 			message.channel.bulkDelete(amount);
		} else {
			message.channel.send('Недостаточно прав.')
		}
	}

}