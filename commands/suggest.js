module.exports = {
    name: 'пред',
    description: 'Suggestions!',
    execute(message, args) {

        if (message.channel.type === 'dm') {
            let msg = message.content.slice(5)
            message.client.channels.cache.get(process.env.SUGGEST_CHANNEL).send({embed:{
                "color": 3553599,
                "description": `${msg}`,
                "author": {
                    "name": `${message.author.username}`,
                    "icon_url": `${message.author.displayAvatarURL()}`
                }
            }}).then(function (message){
              message.react("⬆️");
              message.react("⬇️");
            });
            message.author.send("Ваше предложение получено!");
        } else {
            message.channel.send("Команда работает только в ЛС Майлза.")
        } 
    }
}
