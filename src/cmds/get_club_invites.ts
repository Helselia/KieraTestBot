import { Client as DClient, Message as DMessage } from 'discord.js'
import { Client as HClient, HelseliaRESTError } from 'kiera.js'
import { toCodeBlock } from '../util/toCodeBlock'

module.exports = {
  name: 'get_club_invites',
  async execute(_dClient: DClient, hClient: HClient, msg: DMessage, [id, ..._args]: Array<string>) {
    const selectedClub = Array.from(hClient.clubs.values()).find(cl => cl.id == id)
    if(selectedClub == undefined) return msg.channel.send(`Unknown club_id`)

    try {
      let invites = await selectedClub.getInvites()
      if(!invites.length) return msg.channel.send(`No invites for club_id: \`${selectedClub.id}\``)
      let body = ''
      for(const invite of invites) {
        body += `#${invite.channel.name}:\n`
        body += `\tCode: ${invite.code}\n`
        body += `\tTemp: ${invite.temporary}\n`
        body += `\tUses: ${invite.uses}\n`
        body += `\tMax Age: ${invite.maxAge}${invite.maxAge == 0 ? ' (Lasts forever)' : ''}\n`
        body += `\tMax Uses: ${invite.maxUses}${invite.maxUses == 0 ? ' (Infinite)' : ''}\n\n`
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
