import { Client as DClient, Message as DMessage } from 'discord.js'
import { Client as HClient, HelseliaRESTError } from 'kiera.js'
import { toCodeBlock } from '../util/toCodeBlock'

module.exports = {
  name: 'get_club_members',
  async execute(_dClient: DClient, hClient: HClient, msg: DMessage, [id, ..._args]: Array<string>) {
    const selectedClub = Array.from(hClient.clubs.values()).find(cl => cl.id == id)
    if(selectedClub == undefined) return msg.channel.send(`Unknown club_id`)

    try {
      let members = Array.from(selectedClub.members.values())
      let body = ``
      for(const member of members) {
        body += `${member.nick || member.username}:\n`
        body += `\tUser:\n`
        body += `\t\tID: ${member.user.id}\n`
        body += `\t\tDiscriminator: ${member.user.discriminator}\n`
        body += `\t\tFlags: ${member.user.publicFlags || 0}\n`
        body += `\t\tAvatar (hash): ${member.avatar || 'None'}\n`
        body += `\t\tBot: ${member.user.bot}\n`
        body += `\tStatus: ${member.status}\n`
        body += `\tNickname: ${member.nick || 'None'}\n`
        body += `\tPremium Since: ${member.premiumSince}\n`
        body += `\tRole Count: ${member.roles.length}\n\n`
      }
      msg.channel.send(toCodeBlock(body))
    } catch(e) {
      if(e instanceof HelseliaRESTError && e.code == 50013) {
        msg.channel.send(`Missing permissions.`)
      } else {
        console.error(e)
        msg.channel.send(`Unknown error. Check logs`)
      }
    }
  }
}
