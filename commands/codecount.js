const {
    SlashCommandBuilder,
} = require('discord.js');
const { tryReadFile } = require('../functions/tryReadFile');

const filePath = "./assets/data/codes.json"

function codeCount() {
    let codeFile = tryReadFile(filePath)
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
        return await interaction.reply(codeCount())
    },
}