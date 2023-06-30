const fs = require('fs');

const filePath = "./assets/data/allowedUsers.json"

module.exports.checkAllowed = function (interaction) {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    try {
        const data = JSON.parse(jsonData);
        if (data.includes(interaction.user.id)) {
            return true
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
};