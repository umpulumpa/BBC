const {
    SlashCommandBuilder, underscore
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');
const { checkAllowed } = require('../functions/checkAllowed');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetFile');

function tryAddCodes(interaction) {
    let codes = interaction.options.getString('codes');
    if (codes == undefined) {
        return "No codes provided"
    }

    let codeFile = tryReadFile("codes.json", interaction.guild.id)
    if (codeFile === false) {
        return "There was an error trying to get existing codes"
    }
    const gameVersion = "v10"
    const dateadded = Date.now()
    let parsedCodeArray = codes.split(/,|\s/)
    let counter = 0
    parsedCodeArray.forEach(code => {
        if (code == undefined || code == "") {
            return
        }
        let codeObject = {
            code: code,
            gameVersion: gameVersion,
            addedBy: interaction.user.username,
            dateadded: dateadded,
        }
        const found = codeFile.some(acode => acode.code === code);
        if (!found)  {
            codeFile.push(codeObject)
            counter += 1
        };
    });
    if (trySetFile(`./assets/data/servers/${interaction.guild.id}/codes.json`, codeFile)) {
        return `Successfully added ${counter} codes`
    } else {
        return "There was an error adding the codes."
    }
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addcodes')
        .setDescription('Adds one or more codes.')
        .addStringOption(option =>
			option
				.setName('codes')
				.setDescription('Add one or more codes separated by a space or comma')
                .setRequired(true)
        ),
    async execute(client, interaction) {
        if (checkAllowed(interaction) || await checkAdmin(client, interaction)) {
            return await interaction.reply({ content: tryAddCodes(interaction), ephemeral: true })
        } else {
            return await interaction.reply({ content: "You don't have permission to execute this command.", ephemeral: true })
        }
        
    },
}