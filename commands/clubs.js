const Discord = require('discord.js')
const clubsEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Клубы и участники сетевой')
  .setURL('https://discord.js.org/')
  .setAuthor(
    'СЕТЕВАЯ БРИТАНИЯ 2021',
    'https://i.imgur.com/wSTFkRM.png',
    'https://discord.js.org'
  )
  .setThumbnail('https://i.imgur.com/wSTFkRM.png')
  .addFields(
    {
      name: 'Клуб',
      value: `<:blackb:788128062763958352> Blackburn
    <:clBlackpool:788132421844467723> Blackpool
    <:clCharlton:788449223796195379> Charlton
    <:clCork:787462185625845790> Cork
    <:clCrewe:788453149249110058> Crewe
    <:clDundee:788439059604439070> Dundee
    <:clDundeeU:788434818437218326> Dundee United
    <:clIpswich:787421399714365470> Ipswich
    <:clKilmarnock:788401253205278741> Kilmarnock
    <:clBoro:788434937618497536> Middlesbrough
    <:clNomads:788459617897414656> Connah's Quay
    <:clForest:787418118027739137> Nottingham Forest\u00A0\u00A0\u00A0
    <:clOxford:787800122251149392> Oxford United
    <:clPartick:788121883371372594> Partick Thistle
    <:clPortsmouth:787772178732154910> Portsmouth
    <:clHearts:793473176289935370> Hearts
    <:clSunderland:787447964079489064> Sunderland
    <:clSwindon:787780499900727346> Swindon Town`,
      inline: true,
    },
    {
      name: 'Менеджер [ассистент]',
      value:
        ':england: maximko\n:england: hooligan4ik\n:england: al necheporenko\n:flag_ie: monkey-d-lufffy\n:england: plasteelin\n:scotland: tem\n:scotland: Criomar\n:england: Igor\n:scotland: Dragovic1982\n:england: Rak Tyt\n:wales: piggy\n:england: Arisen\n:england: Alxun\n:scotland: Ilya [Klatz_Klatz]\n:england: AstraDelic [e5ison]\n:england: SmX\n:england: YurDav\n:england: SMS',
      inline: true,
    }
  )

module.exports = {
  name: 'clubs',
  description: 'Clubs',
  execute(message, args = null) {
    message.channel.send(clubsEmbed)
  },
}
