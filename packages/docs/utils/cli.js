const config = require('./config');


let _debug = false;
const NODE_INTERNAL_INDEX_TO_IGNORE = 2;
const cliArguments = process.argv.slice(NODE_INTERNAL_INDEX_TO_IGNORE);
const allowedFlags = ['--debug', '--file', '--update'];
const configData = config();

module.exports = {
    debugMode() {
        return _debug
    },
    noArgs() {
        return !cliArguments.length;
    },
    singleFileMode() {
        return cliArguments.some(arg => arg == '--file');
    },
    updateMode() {
        return cliArguments.some(arg => arg == '--update');
    },
    flagAllowed(flag) {
        return allowedFlags.includes(flag)
    },
    firstArg: cliArguments[0],
    secondArg:  cliArguments[1] || '',
    cliArguments,
    allowedFlags,
    config: configData
}