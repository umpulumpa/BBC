const tmi = require('tmi.js');
require('dotenv').config();

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

client.connect();

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self) return;
  console.log(tags)
  if(message.toLowerCase() === '!code') {
    client.say(channel, `@${tags.username}, ${getCode()}`);
  }
});
