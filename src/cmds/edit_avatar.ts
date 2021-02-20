import { Client as DClient, Message as DMessage } from 'discord.js'
import { Client as HClient } from 'kiera.js'
import fetch from 'node-fetch'
import { res64 } from '../util/res64'

module.exports = {
  name: 'edit_avatar',
  async execute(dClient: DClient, hClient: HClient, msg: DMessage, _args: Array<string>) {
    if(!msg.attachments.size) return msg.channel.send(`Missing avatar file...`)

    let av = msg.attachments.first()
    let av64 = `data:image/png;base64,${await res64(await fetch(av?.url || ''))}`

    try {
      let newUser = await hClient.editSelf({
        avatar: av64
      })

      msg.channel.send(`Successful avatar change: ${newUser.avatarURL}`)
    } catch(e) {
      msg.channel.send(`Error while changing avatar, check logs.`)
      console.error(e)
    }
  }
}
