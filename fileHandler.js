var fs = require('fs');

module.exports = {
    checkFile : (fileName) => fs.existsSync(fileName),
    readFile : (fileName) => {
        var rawdata = fs.readFileSync(fileName);
        var data = JSON.parse(rawdata);
        return data;
    },
    writeFile : (fileName , obj) => {
        fs.writeFile(fileName,JSON.stringify(obj,null,2),(err) => {
            if(err) throw err;
            console.log(`${fileName} is saved for future reference.`);
        });
    }
};
