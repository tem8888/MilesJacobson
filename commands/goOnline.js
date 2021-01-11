module.exports = {
	name: 'го',
	description: 'Оповещаем людей о заходе на сервер',
	execute(message, args) {

		if (message.member.hasPermission("MANAGE_MESSAGES")) {
			message.channel.send(`> <@&${process.env.ONLINE_ROLE}> 📢 ЗАХОДИМ ➡️ Сервер - Britannia Network, пароль - 2022, Регион - Russian Moscow`);
     let interval = setInterval (function () {
        message.channel.send(`> <@&${process.env.ONLINE_ROLE}> 📢 ЗАХОДИМ ➡️ Сервер - Britannia Network, пароль - 2022.`)
      }, 3000); 
    	setTimeout (function () {
      	clearInterval(interval);
    	}, 12000);
		} else {
			message.channel.send('Недостаточно прав.')
		}

	}
}