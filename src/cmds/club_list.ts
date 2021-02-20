import { Client as DClient, Message as DMessage } from 'discord.js'
import { Client as HClient } from 'kiera.js'
import { toCodeBlock } from '../util/toCodeBlock'

module.exports = {
  name: 'club_list',
  async execute(_dClient: DClient, hClient: HClient, msg: DMessage, _args: Array<string>) {
    let clubs = Array.from(hClient.clubs.values()).slice(0, 20)
    let body = ''
    for(const club of clubs) {
      body += `${club.name}:\n`
      body += `\tID: ${club.id}\n`
      body += `\tcreatedAt: ${club.createdAt}\n`
      body += `\tFeatures: ${club.features.join(`, `)}\n`
      body += `\tIcon (hash): ${club.icon || 'none'}\n`
      body += `\tRegion: ${club.region}\n`
      body += `\tVerified: ${club.features.includes("VERIFIED")}\n`
      body += `\tRole Count: ${club.roles.size}\n`
      body += `\tChannel Count: ${club.channels.size}\n`
      body += `\tEmoji Count: ${club.emojis.length}\n`
      body += `\tUnavailable: ${club.unavailable}\n\n`
    }
    msg.channel.send(toCodeBlock(body))
  }
}
