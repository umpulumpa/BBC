const fs = require('fs');
module.exports.tryReadFile = function (filePath) {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    try {
        const data = JSON.parse(jsonData);
        return data
    } catch (error) {
        console.log(error)
        return false
    }
};