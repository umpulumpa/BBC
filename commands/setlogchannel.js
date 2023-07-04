const {
    SlashCommandBuilder, ChannelType,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetFile');

async function setLogChannel(client, interaction) { 
    if (!await checkAdmin(client, interaction)) {
        return "You're not an administrator."
    }
    const channelId = interaction.options.getChannel('channel').id
    tryReadFile("logChannel.json", interaction.guild.id)
    if (trySetFile(`./assets/data/servers/${interaction.guild.id}/logChannel.json`, [channelId])) {
        return `${interaction.options.getChannel('channel')} has been set as the log channel`
    } else {
        return "There was an error setting the log channel"
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlogchannel')
        .setDescription('Sets a log channel')
        .addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel you want to set')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(client, interaction) {
        return await interaction.reply({ content: await setLogChannel(client, interaction), ephemeral: true })
    },
}