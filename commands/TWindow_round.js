const User = require('../models/User')
const Bid = require('../models/Bid')
const Transfer = require('../models/Transfer')
const sendWinnersMessages = require('../functions/sendWinnersMessages')
const editMoneyTable = require('../functions/editMoneyTable');
const roundEnd = require('../functions/roundEnd');
const roundStart = require('../functions/roundStart');
const Squad = require('../models/Squad');

module.exports = {
	name: 'round',
	description: 'Round starter',
	execute(message, args) {

		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`❌ Недостаточно прав.`);
		if (args.length !== 2) return message.channel.send(`❌ Неправильное число аргументов.`);
		let round = Number(args[0]) // номер раунда как второй параметр

		if (args[1] === 'start') {
			message.channel.send(`☑️ РАУНД ${round} НАЧАЛСЯ.`);
			roundStart(round)
		} 
		if (args[1] === 'check') {
			let msgContent = ''
			User.find({currentRound: round})
				.then((users) => {
					for (user of users) {
						msgContent += `🦥 ${user.username}\n`
					}
					message.channel.send(`Кто еще не сделал бид?\n\n${msgContent}`);
				})
		} 
		else if (args[1] === 'end') {
			message.channel.send(`✅ РАУНД ${round} ЗАКОНЧЕН.`);
		
			Bid.find({round: 0}) // Ищем биды, которые еще не были обработаны
				.then( async (bidList) => { 
					const bidWinnersList = []
	 label: for (let i=1; i <= bidList.length; i++) {
					let myBid = bidList[i-1]
					let winnerBid = {}
					winnerBid.losers = []
					let checkBid = false // Проверка, что на игрока были другие биды

					for (bid of bidWinnersList) { // Проверка на повторение
						if (bid.playerId === myBid.playerId) {
							continue label;
						}
					}	

					if (i < bidList.length) {
						for (bid of bidList.slice(i)) {
							if (myBid.playerId === bid.playerId) { // Если нашлось пересечение по игроку
								checkBid = true
								let coeff1 = myBid.price * (bid.place / 100 + 1) * bid.coeff
								let coeff2 = bid.price * (myBid.place / 100 + 1) * myBid.coeff
								if (coeff1 < coeff2) { 
									
									winnerBid = Object.assign(bid, winnerBid)
									winnerBid.losers.push({club: myBid.club, price: myBid.price, editPrice: myBid.price*bid.coeff})

								} else if (coeff1 > coeff2) {

									winnerBid = Object.assign(myBid, winnerBid)
									winnerBid.losers.push({club: bid.club, price: bid.price, editPrice: bid.price*myBid.coeff})

								} else {	// Если случилась ничья, определяем победителя по занятой позиции
									myBid.place > bid.place ? winnerBid = myBid : winnerBid = bid
								}
							} 
							else if (!checkBid) { // Если не было пересечений, значит выиграл первый в списке бид
								winnerBid = myBid
							}
						}
					} else {
					winnerBid = bidList[i-1]
				}	
					bidWinnersList.push(winnerBid) // сохраняем победителей в отдельный массив
					await User.findOneAndUpdate( // обновляем баланс клубов в БД
						{userId: winnerBid.userId}, {$inc: {money: -winnerBid.price, coeff: 1}}, {useFindAndModify: false})
					await Transfer.findOneAndUpdate(
						{uid: winnerBid.playerId}, {status: 'finished'}, {upsert: true, useFindAndModify: false})
					let newSquadPlayer = new Squad({uid: winnerBid.playerId, name: winnerBid.player, club: winnerBid.club})
					await newSquadPlayer.save()
				}

				editMoneyTable(message) // Редактируем таблицу с балансами команд
				sendWinnersMessages(bidWinnersList, message) // Отправляем сообщения о совершившихся трансферах
				roundEnd(round) // Обновляем поле Раунд для бидов

			})
			.catch((error) => { console.log('error: ', error) })
		}
	}
}