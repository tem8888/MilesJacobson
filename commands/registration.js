module.exports = {
	name: 'reg',
	description: 'Send registration info',
	execute(message, args) {

		if (message.channel.type === 'dm') {

			let regMsg = message.content.toString();
      let regMsgLen = message.content.split("\n").length-1;

      if (regMsgLen >= 5) {
          message.client.channels.cache.get(process.env.REG_CHANNEL).send(`>>> Новая регистрация от пользователя **${message.author}**\n${message.content.slice(7)}`);
          message.author.send("Анкета получена! Как только администраторы ее проверят, вам выдадут новую роль на сервере.")
      } else {
          message.author.send('Анкета заполнена неверно.');
      }
		} else {
			message.reply('Анкету в ЛС!')
		}

	}
}