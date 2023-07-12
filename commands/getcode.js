const {
    SlashCommandBuilder,
} = require('discord.js');
const { checkAdmin } = require('../functions/checkAdmin');
const { checkAllowed } = require('../functions/checkAllowed');
const { tryReadFile } = require('../functions/tryReadFile');
const { trySetFile } = require('../functions/trySetFile');

async function trygetCode(client, interaction) {
    if (!(await checkAdmin(client, interaction)) && !checkAllowed(interaction)) {
        let limitFile = tryReadFile("userLimits.json", interaction.guild.id)
        let userObj = limitFile.findIndex(item => item.userId === interaction.user.id)
        if (limitFile[userObj] != undefined && userObj > -1) {
            if (limitFile[userObj].currentCount != "*" && limitFile[userObj].limit >= limitFile[userObj].currentCount) {
              return "You can only claim 1 code"
            } else {
              limitFile[userObj].currentCount += 1
              limitFile[userObj].lastUpdate = Date.now()
            }
          } else {
            const userLimits =  {
                "userId": interaction.user.id,
                "limit": 1,
                "currentCount": 1,
                "lastUpdate": Date.now()
            }
            limitFile.push(userLimits)
        }
        trySetFile(`./assets/data/servers/${interaction.guild.id}/userLimits.json`, limitFile)
    }

    
    let codeFile = tryReadFile("codes.json", interaction.guild.id)
    if (codeFile === false) {
        return "There was an error trying to get the codes"
    }    
    if (codeFile.length > 0) {
        const code = codeFile.shift();
        trySetFile(`./assets/data/servers/${interaction.guild.id}/codes.json`, codeFile)
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
        return { content: await trygetCode(client, interaction), ephemeral: true }
    },
}