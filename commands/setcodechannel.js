const {
    SlashCommandBuilder, ChannelType, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');

function createSetupMessage() {
    const select = new StringSelectMenuBuilder()
			.setCustomId('setupMenu')
			.setPlaceholder('Make a selection!')
            .setMinValues(1)
			.setMaxValues(3)
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Get Code')
					.setDescription('A get code button which returns a code to the user.')
					.setValue('getcode'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Code count')
					.setDescription('This button will return the amount of codes left in the database.')
					.setValue('codecount'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Game update')
					.setDescription('This is an admin only command to clear all current codes.')
					.setValue('gameupdate'),
    );
    return [new ActionRowBuilder().addComponents(select)];
}


function createCodeMessageText(interaction) {

    const optionTexts = {
        "getcode": "**/getcode**\n- Use this button to get a unused clan invite code. \n- Please note that you sometimes have to restart the game after using a code for it to work.\n- If the code doesn't work after a game restart please contact an admin.\n\n",
        "codecount": "**/codecount**\n- Use this button to get the amount of codes left in the system.\n\n",
        "gameupdate": "**/gameupdate**\n- This is an admin only button to update the codes in the system when the game has a major update.\n\n"
    }
    const header = "## Hi! \n\nPlease use this message to interact with the bot!\n\n"
    const footer = "*If you have any questions please contact an admin.*\n\n"
    let content = "### Options:\n\n"
    interaction.values.forEach(value => {
        if (optionTexts[value]) {
            content += optionTexts[value]
        }
    });
    return `${header}${content}${footer}`
}

function createCodeMessageButtons(interaction) {
    let buttons = []
    interaction.values.forEach(value => {
        const button = new ButtonBuilder()
        .setCustomId(value)
        .setLabel(value)
        .setStyle(ButtonStyle.Primary);
        buttons.push(button)
    });
    return [new ActionRowBuilder().addComponents(buttons)];
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcodechannel')
        .setDescription('Sets a code channel')
        .addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel you want to set')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    async execute(client, interaction) {
        if (!await checkAdmin(client, interaction)) {
            return { content: "You're not an administrator."}
        }
        if (interaction.customId && interaction.customId == "setupMenu") {
            return  { content: createCodeMessageText(interaction), components: createCodeMessageButtons(interaction), ephemeral: true }
        } else {
            return { content: "Choose which options you'd like to enable", components: createSetupMessage(), ephemeral: true }
        }
    },
}