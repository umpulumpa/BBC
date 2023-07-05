const {
    SlashCommandBuilder,
} = require('discord.js');
const { tryReadFile } = require('../functions/tryReadFile');

function codeCount(interaction) {
    let codeFile = tryReadFile("codes.json", interaction.guild.id)
    if (codeFile === false) {
        return "There was an error trying to get the codes"
    }   
    return `There are currently ${codeFile.length} codes available.`

    
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('codecount')
        .setDescription('Gets the amount of available codes.'),
    async execute(client, interaction) {
        return { content: codeCount(interaction), ephemeral: true }
    },
}