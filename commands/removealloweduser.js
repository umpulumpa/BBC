const {
    SlashCommandBuilder,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetFile');

const filePath = "./assets/data/allowedUsers.json"

async function removeAllowedUser(client, interaction) { 
    if (!await checkAdmin(client, interaction)) {
        return "You're not an administrator."
    }
    let userFile = tryReadFile(filePath)
    const userId = interaction.options.getUser('user').id
    if (userFile.includes(userId)) {
        const index = userFile.indexOf(userId);
        userFile.splice(index, 1);
        if (trySetFile(filePath, userFile)) {
            return `User: ${interaction.options.getUser('user').username} with user id: ${userId} has been removed from the whitelist`
        } else {
            return "There was an error removing the user"
        }
    } else {
        return "User is not on the whitelist"
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('removealloweduser')
        .setDescription('Removes a user from the whitelist')
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription('The user you want to remove')
                .setRequired(true)
        ),
    async execute(client, interaction) {
        return await interaction.reply({ content: await removeAllowedUser(client, interaction), ephemeral: true })
    },
}