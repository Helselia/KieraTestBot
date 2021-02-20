import { Client as DClient, Message as DMessage } from 'discord.js'
import { Client as HClient, HelseliaRESTError } from 'kiera.js'
import { toCodeBlock } from '../util/toCodeBlock'
import { channelTypeToString } from '../util/typeToString'

module.exports = {
  name: 'get_club_channels',
  async execute(_dClient: DClient, hClient: HClient, msg: DMessage, [id, ..._args]: Array<string>) {
    const selectedClub = Array.from(hClient.clubs.values()).find(cl => cl.id == id)
    if(selectedClub == undefined) return msg.channel.send(`Unknown club_id`)

    try {
      let channels = Array.from(selectedClub.channels.values())
      let body = ''
      for(const chan of channels) {
        body += `#${chan.name}:\n`
        body += `\tID: ${chan.id}\n`
        body += `\tPosition: ${chan.position}\n`
        body += `\tParent ID: ${chan.parentID || 'None'}\n`
        body += `\tType: ${channelTypeToString(chan.type)}\n\n`
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
