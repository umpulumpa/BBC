const fs = require('fs');
const { getServerPath } = require('./getServerPath');
module.exports.tryReadFile = function (fileName, guildId = false) {
    let filePath = undefined
    if (guildId != false) {
        filePath = getServerPath(guildId, fileName)
        if (filePath == false) {
            return false
        }
    } else {
        filePath = fileName
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    try {
        const data = JSON.parse(jsonData);
        return data
    } catch (error) {
        console.log(error)
        return false
    }
};