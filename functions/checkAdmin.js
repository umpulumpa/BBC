const {
    PermissionsBitField,
} = require('discord.js');

module.exports.checkAdmin = async function (client, interaction) {
    try {
        const guild = await client.guilds.fetch(interaction.guild.id);
      
        const member = guild.members.cache.get(interaction.user.id);
        return member.permissions.has(PermissionsBitField.Flags.Administrator)
     } catch (err) {
        console.error(err);
        return false
     }
};