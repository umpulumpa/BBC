const {
    SlashCommandBuilder,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');
const { checkAllowed } = require('../functions/checkAllowed');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetFile');

const filePath = "./assets/data/codes.json"

function gameUpdate() {
    let codeFile = tryReadFile(filePath)
    if (codeFile === false) {
        return "There was an error trying to get the codes"
    }   
    const currentDate = Date.now() 
    newCodeList = []
    codeFile.forEach(code => {
        if (code.dateAdded >= currentDate) {
            newCodeList.push(code)
        }
    });
    if (trySetFile(filePath , newCodeList) == false) {
        return "There was an error removing the old codes. <@244867479996727296>"
    } else {
        const removedCodesCount = codeFile.length - newCodeList.length
        return `Successfully updated the codes, removed ${removedCodesCount} codes.`
    }

    
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('gameupdate')
        .setDescription('Removes all old game codes.'),
    async execute(client, interaction) {
        if (checkAllowed(interaction) || await checkAdmin(client, interaction)) {
            return await interaction.reply({ content: gameUpdate(), ephemeral: true })
        } else {
            return await interaction.reply({ content: "You don't have permission to execute this command.", ephemeral: true })
        }
    },
}