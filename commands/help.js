module.exports = {
  name: 'help',
  description: 'Help',
  execute(message, args = null) {
    if (!args[0]) {
      message.channel.send({
        embed: {
          color: 3553599,
          title: `🤔 Команды бота для трансферной активности 🤔`,
          fields: [
            {
              name: `!s`,
              value: `Поиск игроков среди доступных для трансфера
            Пример использования: **!s имя\_игрока**
            Нажав на реакцию под результатом поиска, оформляется бид (во время ТО и только в ЛС).`,
            },
            {
              name: `!bid`,
              value: `Сделать бид на игрока во время ТО. Работает только в активном раунде и в ЛС бота.
            Пример использования: **!bid id\\_игрока сумма\\_трансфера**\n**!bid id\\_игрока cancel** для отмены`,
            },
            {
              name: `!team`,
              value: `Показывает список игроков клуба. Параметров не имеет, клуб привязан к ID менеджера и ассистента.`,
            },
            {
              name: `!kick`,
              value: `Отчисление игрока из своей команды.
            Пример использования: **!kick id\_игрока**`,
            },
            {
              name: `!offer`,
              value: `Осуществление трансферов и обменов между клубами.
            Для трансфера за валюту используется параметр: buy, для обмена - exchange.
            Все вводится в одну строку и каждый параметр разделяется пробелами.`,
            },
            {
              name: `buy`,
              value: `Покупка чужого игрока. Вводится менеджером покупающей стороны!
            Пример использования: **!offer buy id\\_чужого\\_игрока сумма\\_трансфера**`,
              inline: true,
            },
            {
              name: `exchange`,
              value: `Обмен между клубами.
            Пример использования: **!offer exchange id\\_своего\\_игрока доплата id\\_чужого\\_игрока доплата**`,
              inline: true,
            },
          ],
        },
      })
    } else if (args[0] === 'admin')
      message.channel.send({
        embed: {
          color: 3553599,
          title: `🤔 ADMIN HELP 🤔`,
          fields: [
            {
              name: `!reset`,
              value: `Сброс всех раундов и очистка всех сделанных бидов. Выполняется перед следующим ТО.`,
            },
            {
              name: `!force`,
              value: `Принудительно перевести всех менеджеров, кто не делал бид, в следующий раунд. 
            Пример использования: **!froce номер_следующего_раунда**.`,
            },
            {
              name: `!round`,
              value: `Управление раундами во время ТО.
            Пример использования: **!round номер_раунда задача**. Список задач ниже.
            Все вводится в одну строку и каждый параметр разделяется пробелами.`,
            },
            {
              name: `start`,
              value: `Запуск раунда.`,
              inline: true,
            },
            {
              name: `end`,
              value: `Завершение раунда.`,
              inline: true,
            },
            {
              name: `check`,
              value: `Выводит список менеджеров, которые еще не сделали пик в текущем раунде.`,
              inline: true,
            },
          ],
        },
      })
  },
}
