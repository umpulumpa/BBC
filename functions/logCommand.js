const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const { tryReadFile } = require('./tryReadFile');
const { trySetFile } = require('./trySetFile');
module.exports.logCommand = async function (client, interaction, success) {
    let logs = tryReadFile("logs.json", interaction.guild.id)
    if (logs !== false) {
        const log = {
            "timestamp": Date.now(),
            "userId": interaction.user.id,
            "userName": interaction.user.username,
            "channelId": interaction.channel.id,
            "channelName": interaction.channel.name,
            "command": interaction.commandName,
        }
        logs.push(log)
        trySetFile(`./assets/data/servers/${interaction.guild.id}/logs.json`, logs)
    }
    const logChannel = tryReadFile("logChannel.json", interaction.guild.id)
    if (logChannel !== false && logChannel.length > 0) {
        try {
            const channel = client.channels.cache.get(logChannel[0]);
            if (channel != undefined) {
                const logEmbed = new EmbedBuilder()
                .setColor(0x379c6f)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setDescription(`**${interaction.user} used the */${interaction.commandName}* command**`)
                .setTimestamp()
                .setFooter({ text: interaction.user.id})
            
                return await channel.send({ embeds: [logEmbed] });
            } else return false
            
         } catch (err) {
            console.error(err);
            return false
         }
    }

    // try {
    //     const updatedJsonData = JSON.stringify(fileData, null, 2);
    //     fs.writeFileSync(filePath, updatedJsonData);
    //     return true
    // } catch (error) {
    //     console.log(error)
    //     return false
    // }
};