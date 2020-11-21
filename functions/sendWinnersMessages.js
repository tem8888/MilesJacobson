const sendWinnersMessages = (bidWinnersList, message) => {
    let bidCount = 0
    let interval = setInterval (async function () {
      message.channel.send({embed:{
        color: 3553599,
        description: `✅ Клуб **${bidWinnersList[bidCount].club}** завершил сделку по игроку **${bidWinnersList[bidCount].player}**.\n💷 Сумма трансфера: **${bidWinnersList[bidCount].price}**`,
      }});
      bidCount += 1
    }, 2000); 
   
    setTimeout(async function(){
      clearInterval(interval);
    }, 2000*(bidWinnersList.length+1));
}

module.exports = sendWinnersMessages