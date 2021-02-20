import { Client as DClient, Message as DMessage, MessageEmbed } from 'discord.js'
import { Client as HClient } from 'kiera.js'
import ms from 'ms'

module.exports = {
  name: 'bot_status',
  async execute(_dClient: DClient, hClient: HClient, msg: DMessage, _args: Array<string>) {
    let hStatus = new MessageEmbed()
    .setTitle(`${hClient.user.username}'s Status`)
    .setAuthor(`${hClient.user.username}#${hClient.user.discriminator}`, hClient.user.avatarURL || undefined)
    .setColor('LUMINOUS_VIVID_PINK')
    .addFields([
      { name: 'Memberships', value: `${hClient.clubs.size}`, inline: true },
      { name: 'Is Bot?', value: hClient.bot ? 'Yes' : 'No', inline: true },
      { name: 'Gateway', value: hClient.gatewayURL || 'None', inline: false },
      { name: 'Uptime', value: `${ms(hClient.uptime)}`, inline: true },
      { name: 'Verified', value: hClient.user.verified, inline: true },
      { name: 'Email', value: hClient.user.email, inline: true },
      { name: '2fa?', value: hClient.user.mfaEnabled, inline: true },
      { name: 'ID', value: hClient.user.id, inline: true },
      { name: 'Username', value: hClient.user.username, inline: true },
      { name: 'Avatar hash', value: hClient.user.avatar || 'None', inline: false }
    ])
    msg.channel.send(hStatus)
  }
}
