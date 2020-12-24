module.exports = {
	name: 'del',
	description: 'Delete last messages',
	execute(message, args) {

		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send('❌ Недостаточно прав.')
		let amount = args[0] || 10
		message.channel.bulkDelete(amount);
	}
}