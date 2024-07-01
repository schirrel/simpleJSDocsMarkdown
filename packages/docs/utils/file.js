const { error } = require('../../console/log');
const { config } = require('../utils/cli');
const { exec } = require('node:child_process')
const fg = require('fast-glob');
const fs = require('fs');
const {
    parseComment,
} = require('@es-joy/jsdoccomment');
const yargs = require('yargs');


const argv = yargs
    .parserConfiguration({ 'duplicate-arguments-array': false })
    .option('file', {
        alias: 'file',
        type: 'string',
        description: 'Single File'
    }).option('update', {
        alias: 'update',
        type: 'boolean',
        description: 'Update edited'
    }).option('debug', {
        alias: 'debug',
        type: 'boolean',
        description: 'Debug mode'
    })
const args = argv.argv;


// Constants
const inputFiles = config.files;
const outputDir = config.output;
const docNameForIndexFiles = config.barrelFilesName;;
const filesToIgnore = config.filesToIgnore;


// Functions
const isBarrelFile = (fileName) => /index.js$/.test(fileName) || /\/index$/.test(fileName);

const filenameAdjust = (file) => file.replace('./outputs/dist/', '').replace('.js', '.md');

const correctDocName = (file) => file.replace('index', 'README')

const getFilesPath = async () => {
    if (args.file)
        return args.file.replace('.ts', '.js').replace('src', 'outputs/dist')

    return inputFiles;


}

const getFileData = (file) => {
    try {
        const specTextContent = fs.readFileSync(file, { encoding: 'utf8' });
        const testInfoData = parseComment(specTextContent);
        return testInfoData;
    } catch (exception) {
        return null
    }
}

const convertFileRegex2FileList = (path) => fg.globSync(path, { dot: true })

const writeFile = (destination, template) => {
    try {
        fs.writeFileSync(destination, template)
    } catch (exception) {
        // in case of directory not created yet
        const directories = destination.split('/');
        directories.pop();
        const finalPath = directories.join('/');
        fs.mkdirSync(finalPath, { recursive: true });
        fs.writeFileSync(destination, template)
    }
}

module.exports = {
    outputDir, docNameForIndexFiles, filesToIgnore,
    isBarrelFile, filenameAdjust, correctDocName, getFilesPath, getFileData, convertFileRegex2FileList, writeFile
}