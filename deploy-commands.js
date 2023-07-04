const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

let dev = false
if (process.argv[2]) {
	console.log("dev Mode")
	dev = true
}
let configPath = ""
if (dev == true) {
	configPath = './dev-config.json'
} else {
	configPath = './config.json'
}
const { clientId, token } = require(configPath);



const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);
rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);