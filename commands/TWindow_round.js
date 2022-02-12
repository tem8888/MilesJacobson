const User = require('../models/User')
const Bid = require('../models/Bid')
const Player = require('../models/Player')
const sendWinnersMessages = require('../functions/sendWinnersMessages')
const editMoneyTable = require('../functions/editMoneyTable')
const roundEnd = require('../functions/roundEnd')
const roundStart = require('../functions/roundStart')
const Squadlist = require('../models/Squadlist')

module.exports = {
  name: 'round',
  description: 'Round starter',
  execute(message, args) {
    if (!message.member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send(`❌ Недостаточно прав.`)
    if (args.length !== 2)
      return message.channel.send(`❌ Неправильное число аргументов.`)
    let round = Number(args[0]) // номер раунда как второй параметр
    if (args[1] === 'start') {
      message.channel.send(`☑️ <@&${process.env.ONLINE_ROLE}> РАУНД **#${round}** НАЧАЛСЯ.`)
      roundStart(round)
    }
    if (args[1] === 'check') {
      let msgContent = ''
      User.find({ currentRound: round })
        .then((users) => {
          for (user of users) {
            msgContent += `🦥 ${user.username}\n`
          }
          message.channel.send(`Кто еще не сделал бид?\n\n${msgContent}`)
        })
        .catch(() => {
          message.channel.send(`Все сделали биды, молодцы!`)
        })
    } else if (args[1] === 'end') {
      message.client.channels.cache.get(process.env.MAIN_NETWORK_CHANNEL).send(`✅ **РАУНД ${round} ЗАКОНЧЕН.**`)

      Bid.find({ round: 0 }) // Ищем биды, которые еще не были обработаны
        .then( async (bidList) => {
          const bidWinnersList = []

           label: for (let i = 1; i <= bidList.length; i++) {
          //  label: for (const i of Array.from(Array(bidList.length).keys()).slice(1)) {
            let myBid = bidList[i - 1]
            let winnerBid = {losers:[]}
           // let loserBid = {}
          //  winnerBid.losers = []
            let checkBid = false // Проверка, что на игрока были другие биды

            for (bid of bidWinnersList) {
              // Проверка на повторение. Если этот игрок уже есть в списке забранных, то пропускаем его и берем новый бид.
              if (bid.playerId === myBid.playerId) {
                continue label
              }
            }

            if (i < bidList.length) {
              // Перебираем биды из оставшегося массива
              for (bid of bidList.slice(i)) {

                if (myBid.playerId === bid.playerId) {
                  //
                  // Если нашлось пересечение по игроку
                  //
                  checkBid = true

                  let coeff1 = myBid.price * bid.coeff
                  let coeff2 =  bid.price * myBid.coeff

                  if (coeff1 < coeff2) {
                   // winnerBid = bid
                    winnerBid = Object.assign(bid, winnerBid)
                    //loserBid = myBid
                    winnerBid.losers.push({
                      club: myBid.club,
                      price: myBid.price
                    })
                    // winnerBid = Object.assign(winnerBid, bid.toObject())
                    myBid = bid
                  } else if (coeff1 > coeff2) {
                   // winnerBid = myBid
                   winnerBid = Object.assign(myBid, winnerBid)
                    //loserBid = bid

                    winnerBid.losers.push({
                      club: bid.club,
                      price: bid.price
                    })
                    // winnerBid = Object.assign(winnerBid, myBid.toObject())
                  } else {
                    // Если случилась ничья, определяем победителя по занятой позиции
                    myBid.place > bid.place
                      ? (winnerBid = myBid)
                      : (winnerBid = bid)
                  }
                } else if (!checkBid) {
                  // Если не было пересечений, значит выиграл первый в списке бид
                  winnerBid = myBid
                }
              }
            } else {
              winnerBid = bidList[i - 1]
            }

            bidWinnersList.push(winnerBid) // сохраняем победителей в отдельный массив
            let newSquadPlayer = new Squadlist({
              uid: winnerBid.playerId,
              name: winnerBid.player,
              club: winnerBid.club,
              status: 'new',
            })
            await User.findOneAndUpdate(
              //
              // обновляем данные клубов в БД - баланс, коэффициент, число игроков
              //
              { userId: winnerBid.userId },
              {
                $inc: {
                  money: -Number(Math.round(winnerBid.price + 'e2') + 'e-2'),
                  coeff: 0.2,
                  players: 1
                },
              },
              { useFindAndModify: false }
            )
            //
           // Ставим игроку новый статус, чтобы нельзя было повторно кинуть по нему бид
           //
            await Player.findOneAndUpdate(
              { uid: winnerBid.playerId },
              { status: 'done' },
              { upsert: true, useFindAndModify: false }
            )
            
            await newSquadPlayer.save()
          }

          roundEnd(round) // Обновляем поле Раунд для бидов
          editMoneyTable(message) // Редактируем таблицу с балансами команд
          sendWinnersMessages(bidWinnersList, message) // Отправляем сообщения о совершившихся трансферах
          
        })
        .catch((error) => {
          console.log('error: ', error)
        })
    }
  },
}
