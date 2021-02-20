import { Client as DClient, Message as DMessage, MessageEmbed } from 'discord.js'
import { Client as HClient, HelseliaRESTError } from 'kiera.js'
import { promisify } from 'util'

const wait = promisify(setTimeout)

module.exports = {
  name: 'read_channel_messages',
  async execute(_dClient: DClient, hClient: HClient, msg: DMessage, [id, cid, ..._args]: Array<string>) {
    const selectedClub = Array.from(hClient.clubs.values()).find(cl => cl.id == id)
    if(selectedClub == undefined) return msg.channel.send(`Unknown club_id`)

    try {
      let channel = Array.from(selectedClub.channels.values()).find(c => c.id == cid)
      if(!channel) return msg.channel.send(`Unknown channel_id`)
      let messages = (await hClient.getMessages(channel.id)).reverse()
      await msg.channel.send(`preparing to send ${messages.length} messages...`)

      /* Genius Message Parsing (Helselia -> Discord) */
      for(const message of messages) {
        let embeds = []
        let content = ` `

        if(message.content) content = message.content
        for(const embed of message.embeds) {
          let em = new MessageEmbed()
          
          if(embed.title) em.setTitle(embed.title)
          if(embed.content) em.setDescription(embed.content)
          if(embed.author) em.setAuthor(embed.author.name, embed.author.icon_url, embed.author.url)
          if(embed.color) em.setColor(embed.color)
          if(embed.fields) em.addFields(embed.fields)
          if(embed.footer) em.setFooter(embed.footer.text, embed.footer.icon_url)
          embeds.push(em)
        }

        if(embeds.length > 1) {
          for(const embed of embeds) {
            await msg.channel.send({
              embed
            })
            await wait(1000)
          }
          return await msg.channel.send(content)
        } else if(embeds.length) {
          msg.channel.send(content, {
            embed: embeds[0]
          })
        } else {
          msg.channel.send(`${content}${message.editedTimestamp ? ` (edited at ${message.editedTimestamp})` : ``}`)
        }
      }
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
