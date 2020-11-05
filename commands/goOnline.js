module.exports = {
	name: 'го',
	description: 'Оповещаем людей о заходе на сервер',
	execute(message, args) {

		if (message.member.hasPermission("MANAGE_MESSAGES")) {
			message.channel.send("> <@&743165200341008466> 📢 ЗАХОДИМ ➡️ Сервер - Summer All-Stars, пароль - 2020, Регион - Russian Moscow");
     let interval = setInterval (function () {
        message.channel.send("> <@&743165200341008466> 📢 ЗАХОДИМ ➡️ Сервер - Summer All-Stars, пароль - 2020.")
      }, 3000); 
    	setTimeout (function () {
      	clearInterval(interval);
    	}, 12000);
		} else {
			message.channel.send('Недостаточно прав.')
		}

	}
}