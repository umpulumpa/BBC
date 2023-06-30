const fs = require('fs');
module.exports.trySetFile = function (filePath, fileData) {
        try {
            const updatedJsonData = JSON.stringify(fileData, null, 2);
            fs.writeFileSync(filePath, updatedJsonData);
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    };