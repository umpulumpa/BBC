const tmi = require('tmi.js');
require('dotenv').config();
const fs = require('fs');
const { trySetFile } = require('../functions/trySetFile');

const paths = {
  "serverConnections": "../assets/data/serverConnections.json",
  "codes": "../assets/data/servers/{{serverId}}/codes.json",
  "logs": "../assets/data/servers/{{serverId}}/logs.json",
}


const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: 'bilbibot',
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: ['imumpulumpa']
});


function getFile(path) {
  const jsonData = fs.readFileSync(path, 'utf8');
  try {
      const data = JSON.parse(jsonData);
      return data
  } catch (error) {
      console.log(error)
      return false
  }
}

function logCommand(serverId, channel, tags) {
  let logs = getFile(paths["logs"].replace("{{serverId}}", serverId))
  if (logs !== false) {
      const log = {
          "timestamp": Date.now(),
          "userId": tags["user-id"],
          "userName": tags.username,
          "channelId": "twitch",
          "channelName": channel,
          "command": "getCode",
      }
      logs.push(log)
      trySetFile(paths["logs"].replace("{{serverId}}", serverId), logs)
  }
}

function getCode(channel, tags) {
  const channels = getFile(paths["serverConnections"])
  const channelConnection = channels.find(x => x.twitchName === channel)
  const discordServerId = channelConnection.discordServerId
  const codesPath =paths["codes"].replace("{{serverId}}", discordServerId)
  if (fs.existsSync(codesPath)) {
    let codeFile = getFile(paths["codes"].replace("{{serverId}}", discordServerId))
    if (codeFile !== false && codeFile.length > 0) {
      const code = codeFile.shift();
      trySetFile(paths["codes"].replace("{{serverId}}", discordServerId), codeFile)
      logCommand(discordServerId, channel, tags)
      return `${code.code}`
    } else {
      return "No codes available please message @imumpulumpa"
    }
  } else {
    return "Failed to find codes file"
  }
}


client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self) return;
  if(message.toLowerCase().trim().startsWith('!code')) {
    client.say(channel, `@${tags.username}, ${getCode(channel, tags)}`);
  }
});
