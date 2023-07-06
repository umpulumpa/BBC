const {
    SlashCommandBuilder,
    ChannelType,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');

async function clearChat(client, interaction) {
    const channel = client.channels.cache.get(interaction.options.getChannel('channel').id);
    let deletedCount = 0
    let messages = await channel.messages.fetch({ limit: 20 })    

    messages.forEach(message => {
        if (parseInt(message.id) >= parseInt(interaction.options.getString('messageid'))) {
            message.delete()
            deletedCount += 1
        }
    });

    return `Removing ${deletedCount} messages`
    
    
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearchat')
        .setDescription('Removes all chat message after selected message id')
        .addStringOption(option =>
			option
				.setName('messageid')
				.setDescription('The message Id you want to start deleting at')
                .setRequired(true)
        )
        .addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel you want to delete messages in')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(client, interaction) {
        if ( await checkAdmin(client, interaction)) {
            return { content: await clearChat(client, interaction), ephemeral: true }
        } else {
            return { content: "You don't have permission to execute this command.", ephemeral: true }
        }
    },
}