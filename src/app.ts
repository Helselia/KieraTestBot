import { config } from 'dotenv'
config() // Loads .env
import fs from 'fs'
import * as Discord from 'discord.js'
import * as Kiera from 'kiera.js'
const dClient: Discord.Client = new Discord.Client({ disableMentions: 'everyone' })
const hClient: Kiera.Client = new Kiera.Client(process.env.HTOKEN || '', { 
  defaultImageFormat: "png",
  compress: true,
  allowedMentions: {
    everyone: false
  }
})

interface Command {
  name?: string
  execute(dClient: Discord.Client, 
    hClient: Kiera.Client, 
    msg: Discord.Message, 
    args: Array<string>): any
}

let commands: Discord.Collection<string, Command> = new Discord.Collection()
let dCommands = fs.readdirSync(`${__dirname}/cmds`).filter(c => c.toLowerCase().endsWith('.js'))

for(const file of dCommands) {
  try {
    const command = require(`${__dirname}/cmds/${file}`)
    commands.set(command.name, command)
  } catch(e) {
    console.error(`Error while loading command (discord): ${file.split('.')[0]}`, e)
  }
}

dClient.on('ready', () => {
  console.log(`Recieved READY from ${dClient.user?.tag} (${dClient.user?.id})`)
  dClient.user?.setPresence({
    activity: {
      name: 'with the Discord API',
      type: 'PLAYING'
    },
    status: 'online'
  })
})

dClient.on('error', e => {
  console.log(`Discord: `, e)
})

dClient.on('message', async msg => {
  if(msg.channel.type != 'text') return
  if(msg.author.bot || msg.webhookID || !msg.author) return
  if(!msg.content.toLowerCase().startsWith('k.')) return

  let args = msg.content.slice('k.'.length).split(/\s+/)
  let commandName = args.shift()?.toLowerCase()
  let command: Command = commands.get(commandName || '') || { execute: (dClient: Discord.Client, hClient: Kiera.Client, msg: Discord.Message, args: Array<string>) => {} }

  if(!command || !command.name) return

  try {
    await command.execute(dClient, hClient, msg, args)
  } catch(e) {
    console.error(e)
    msg.reply('There was an error trying to execute that command')
  }
})

hClient.on('ready', () => {
  console.log(`Recieved READY from ${hClient.user.username}#${hClient.user.discriminator} (${hClient.user.id})`)
  hClient.editStatus('online', {
    name: 'with the Helselia API',
    type: 0
  })
})

hClient.on('error', e => {
  console.log(`Helselia: `, e)
})

hClient.connect()
dClient.login(process.env.DTOKEN)
