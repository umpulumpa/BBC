const fs = require('fs');

module.exports.createServerFiles = function (guildId) {
    try {
        const path = `./assets/data/servers/${guildId}`
        const files = JSON.parse(fs.readFileSync("./assets/data/files.json", 'utf8'));
        fs.mkdirSync(path);
        files.forEach(file => {
            fs.writeFileSync(`${path}/${file}`, "[]")
        });
        return true
    } catch (error) {
        console.log(error)
        return false 
    }
};