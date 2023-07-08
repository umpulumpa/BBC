const tmi = require('tmi.js');
require('dotenv').config();
const fs = require('fs');
const {
  trySetFile
} = require('../functions/trySetFile');

const paths = {
  "serverConnections": "../assets/data/serverConnections.json",
  "codes": "../assets/data/servers/{{serverId}}/codes.json",
  "logs": "../assets/data/servers/{{serverId}}/logs.json",
  "userLimits": "../assets/data/servers/{{serverId}}/userLimits.json",
}


const client = new tmi.Client({
  options: {
    debug: true
  },
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

function checkLimit(discordServerId, tags) {
  const limitPath = paths["userLimits"].replace("{{serverId}}", discordServerId)
  if (fs.existsSync(limitPath)) {
    let limitFile = getFile(limitPath)
    let userObj = limitFile.findIndex(item => item.userId === tags["user-id"])
    if (limitFile[userObj] != undefined && userObj > -1) {
      if (limitFile[userObj].currentCount != "*" && limitFile[userObj].limit >= limitFile[userObj].currentCount) {
        return false
      } else {
        limitFile[userObj].currentCount += 1
        limitFile[userObj].lastUpdate = Date.now()
        return true
      }
    } else {
      const userLimits = {
        "userId": tags["user-id"],
        "limit": 1,
        "currentCount": 1,
        "lastUpdate": Date.now()
      }
      limitFile.push(userLimits)
    }
    trySetFile(limitPath, limitFile)
    return true
  } else {
    return false
  }
}

function getCode(channel, tags) {
  const channels = getFile(paths["serverConnections"])
  const channelConnection = channels.find(x => x.twitchName === channel)
  if (channelConnection == undefined) return "Couldn't find database."
  const discordServerId = channelConnection.discordServerId
  const codesPath = paths["codes"].replace("{{serverId}}", discordServerId)
  if (fs.existsSync(codesPath)) {
    // console.log(checkLimit(discordServerId, tags))
    // return "x"
    let codeFile = getFile(codesPath)
    if (codeFile !== false && codeFile.length > 0) {
      if (!checkLimit(discordServerId, tags)) return "You've already claimed all allowed codes. Please contact an admin if you need help."
      const code = codeFile.shift();
      trySetFile(codesPath, codeFile)
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
  if (self) return;
  if (message.toLowerCase().trim().startsWith('!code')) {
    client.say(channel, `@${tags.username}, ${getCode(channel, tags)}`);
  }
});