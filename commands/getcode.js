const {
    SlashCommandBuilder,
} = require('discord.js');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetfile');

const filePath = "./assets/data/codes.json"

function trygetCode() {
    let codeFile = tryReadFile(filePath)
    if (codeFile === false) {
        return "There was an error trying to get the codes"
    }    
    if (codeFile.length > 0) {
        const code = codeFile.shift();
        trySetFile(filePath, codeFile)
        return `${code.code}`
    } else {
        return "There are no codes available, please contact a clan admin."
    }

    
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('getcode')
        .setDescription('Gets a clan invite code.'),
    async execute(client, interaction) {
        return await interaction.reply(trygetCode())
    },
}