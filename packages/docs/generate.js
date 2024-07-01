'use strict'
const { log } = require('../console/log');
const fs = require('fs')
const consoleUtils = require('../console/utils');
const render = require('./render');
const {
    outputDir, docNameForIndexFiles, filesToIgnore,
    isBarrelFile, filenameAdjust, correctDocName, getFilesPath, convertFileRegex2FileList, writeFile
} = require('./utils/file');

const { generateFooter, capitalizeFirstLetter, generateIndexHeader, generateBreadCrumb, shouldSkipLine, markdownLink } = require('./utils/docs');

const generateIndexDocs = (file) => {
    const content = fs.readFileSync(file, { encoding: 'utf8', flag: 'r' });
    const data = content.toString()
    const lines = data.split('\n');
    let template = `${generateBreadCrumb(file)}`;

    template += generateIndexHeader(file);

    lines.forEach(line => {
        // empty lines between file
        if (shouldSkipLine(line)) return;
        const regexSearch = /export \* from ([\',\"].*[\',\"])\;/.exec(line);
        if (regexSearch?.length < 2) return;

        const file = regexSearch[1].replaceAll('\'', '');
        const importIsBarrelFile = isBarrelFile(file);
        let filePath, docLink, docText;
        if (importIsBarrelFile) {
            filePath = file.replace('/index', '');
            docText = filePath.split('/').pop();
            docLink = filePath + '/' + docNameForIndexFiles;
        } else {
            filePath = file.split('/');
            docText = filePath.pop();
            docLink = /*filePath.join('/') +*/ file + '.md';
        }
        template += `-  ${markdownLink(capitalizeFirstLetter(docText), docLink.replace('..', '.'))} \n`

    })
    const destination = outputDir + correctDocName(filenameAdjust(file))
    template += generateFooter()

    writeFile(destination, template)
    log((consoleUtils.format('color_green', '\t📖 - Doc successfully generated.')));


}
const generateDoc = async (file) => {

    const destination = outputDir + filenameAdjust(file)
    const content = render(file);
    if (!content) {
        log(`\t🧐 - Skip generating doc, file seems to be empty content. ${consoleUtils.format('color_orange', consoleUtils.format('style_bold', 'Please check the file this may means an error.'))}`);
        return
    }

    const breadcrumb = generateBreadCrumb(file);
    const footer = generateFooter();
    writeFile(destination, breadcrumb + content + footer)
    log((consoleUtils.format('color_green', '\t📖 - Doc successfully generated.')));

}

(async function () {

    /* input and output paths */
    const inputFiles = await getFilesPath();

    const allFiles = Array.isArray(inputFiles) ? inputFiles : convertFileRegex2FileList(inputFiles);

    log('Generating doc based on input files: ' + inputFiles);
    for (const file of allFiles) {
        if (filesToIgnore && filesToIgnore.test(file)) {
            log((consoleUtils.format('color_yellow', `🚫 - File ignored ${file}`)));
            continue;
        }

        if (isBarrelFile(file)) {
            log(`📝 - Generating README file for barrel file${consoleUtils.format('style_italic', consoleUtils.format('color_blue', file))}`);
            generateIndexDocs(file)
            continue
        }

        log(`📝 - Generating doc for ${consoleUtils.format('style_italic', consoleUtils.format('color_blue', file))}`);
        await generateDoc(file);

    }

})()
