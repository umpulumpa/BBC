const fs = require('fs');
const { createServerFiles } = require('./createServerFiles');

module.exports.getServerPath = function (guildId, fileName) {
    try {
        const serverPath = `./assets/data/servers/${guildId}`
        if (fs.existsSync(serverPath)) {
            return `${serverPath}/${fileName}`
        } else {
            if (createServerFiles(guildId)) {
                return `${serverPath}/${fileName}`
            } else {
                return false
            }
        }
        
    } catch (error) {
        console.log(error)
        return false
    }
};