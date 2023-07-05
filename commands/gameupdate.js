const {
    SlashCommandBuilder,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');
const { checkAllowed } = require('../functions/checkAllowed');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetFile');

function gameUpdate(interaction) {
    let codeFile = tryReadFile("codes.json", interaction.guild.id)
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
    if ((trySetFile(`./assets/data/servers/${interaction.guild.id}/codes.json`, newCodeList)) == false) {
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
            return { content: gameUpdate(interaction), ephemeral: true }
        } else {
            return { content: "You don't have permission to execute this command.", ephemeral: true }
        }
    },
}