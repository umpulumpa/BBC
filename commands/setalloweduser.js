const {
    SlashCommandBuilder,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetFile');

const filePath = "./assets/data/allowedUsers.json"

async function setAllowedUser(client, interaction) { 
    if (!await checkAdmin(client, interaction)) {
        return "You're not an administrator."
    }
    let userFile = tryReadFile(filePath)
    const userId = interaction.options.getUser('user').id
    if (userFile.includes(userId)) {
        return "User is already added to the whitelist."
    } else {
        userFile.push(userId)
        if (trySetFile(filePath, userFile)) {
            return `User: ${interaction.options.getUser('user').username} with user id: ${userId} has been added to the whitelist`
        } else {
            return "There was an error adding the user"
        }
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setalloweduser')
        .setDescription('Adds a user to the whitelist')
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription('The user you want to add')
                .setRequired(true)
        ),
    async execute(client, interaction) {
        return await interaction.reply({ content: await setAllowedUser(client, interaction), ephemeral: true })
    },
}