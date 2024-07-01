const fs = require('fs');

module.exports = () => {

    const data = fs.readFileSync('./docs.json');
    const configData = JSON.parse(data);
    const config = configData.docs;
    config.filesToIgnore = config.ignore.length ? new RegExp(`${config.ignore.join('|')}`) : null;

    return config;
}