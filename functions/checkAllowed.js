const { tryReadFile } = require('./tryReadFile');

module.exports.checkAllowed = function (interaction) {
    try {
        const data = tryReadFile("allowedUsers.json", interaction.guild.id)
        if (data !== false, data.includes(interaction.user.id)) {
            return true
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
};