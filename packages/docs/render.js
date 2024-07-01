
const { getFileData } = require('./utils/file');
const jsdoc2md = require('jsdoc-to-markdown');
const { config } = require('./utils/cli');

const getReturnHeaderInfo = (functionData) => {
    if (!functionData.returns) {
        return ''
    }

    return `=> \`${functionData.returns[0].type.names[0]}\``
}

const getCustomTagValue = (customTag) => {
    if (customTag.value) {
        return customTag.value
    }
    return customTag.name + ' ' + customTag.description;
}

const getCustomTags = (data) => {
    const customTags = config.customTags || [];

    if (!customTags) {
        return '';
    }

    const foundTags = data.tags && data.tags.filter(tag => {
        return customTags.includes(tag.tag)
    }) || [];
    const foundCustomTags = data.customTags && data.customTags.filter(tag => {
        return customTags.includes(tag.tag)
    }) || [];

    const tags = [...foundTags, ...foundCustomTags]


    return tags.map(tag => {
        return `\n**${tag.tag}**\n ${getCustomTagValue(tag)}\n`;
    }).join('\n')

}

const getTagsInfo = (data) => {
    const tags = [];
    if (data.tags && data.tags.length) {
        ['abstract', 'extends', 'implements', 'static'].forEach(docTag => {
            data.tags.some(tag => tag.tag == docTag) && tags.push('`' + docTag + '`')
        })
    } else {
        data.abstract && tags.push('`abstract`')
        data.scope === 'static' && tags.push('`static`')
        data.readonly && tags.push('`readonly`')
    }
    return tags.length ? '**tags**: ' + tags.join(', ') + '\t  \n' : '';
}

const getConstructorInfo = (data) => {
    if (!data) return '';
    const cls = data.name.split('.').pop();
    return `\n### constructor\n**new ${cls}(${data.params && data.params.length ? data.params.map(p => p.name).join(', ') : ''})**\n${getParamsInfo(data)}`
}


const getReturnInfo = (functionData) => {
    if (!functionData.returns || !functionData.returns.length) {
        return ''
    }
    return `> returns ${functionData.returns[0].description} \n`
}

const getParamsInfo = (functionData) => {
    if (!functionData.params || !functionData.params.length) {
        return ''
    }

    const paramRows = functionData.params.map(param => {
        return `| \`${param.name}\` ${param.optional ? '' : ' - **required**'}| ${param.description || ''}  | \`${param.type.names.join(' \\|\\| ') || ''}\`  | ${param.defaultvalue || '- '} |    `
    })

    const table = `#### Params  
| name | description | type | default | 
| -- | -- | -- | -- |   
${paramRows.join('\n')}`
    return table + `\n\n`
}

const getExamplesInfo = (functionData) => {
    if (!functionData.examples || !functionData.examples.length) {
        return '';
    }

    const allExamples = functionData.examples.join('\n')

    return '#### Examples\n```ts\n' + allExamples + '\n```\n'
}

const getFunctionsInfo = (functions) => {
    const result = {
        summary: '',
        functions: ''
    }
    const summary = []
    if (!functions || !functions.length) return result;
    const functionTextBuilder = functionData => {
        summary.push(`* *[${functionData.longname.replace('#', '.')}](#${functionData.name})*`)
        let template = `### ${functionData.name} ${getReturnHeaderInfo(functionData)}\n`;
        template += getTagsInfo(functionData);
        template += `${functionData.description ? `${functionData.description} \n` : ''}`;
        template += `${getCustomTags(functionData)}`;
        template += `${getReturnInfo(functionData)}`;
        template += `${getParamsInfo(functionData)}`;
        template += `${getExamplesInfo(functionData)}`;
        return template;
    }

    result.functions = '\n' + functions.map(functionTextBuilder).join(' \n');
    result.summary = summary ? '\n ________________________________  \n## Functions\n' + summary.join(' \n') + '\n' : '';

    return result;
}

const getDocsForClass = (templateData, fileData) => {
    if (templateData) {
        const headerInfo = getTagsInfo(fileData)
        return `# ${templateData.name.split('.').pop()}${headerInfo ? '\n' + headerInfo : ''}\n${templateData.description || ''}  `
    }

    return ''
}

const isFunctionScope = (item) => item.scope == 'instance' || item.scope == 'static';
const isFunctionKind = (item) => item.kind != 'constructor' && item.kind != 'class'

const getClassData = (templateData) => {
    const classes = templateData.find(item => item.kind == 'class')
    if (classes) return classes;

    return templateData.shift();
}

const renderDocsForFiles = (templateData, fileData) => {
    const functionsInfo = getFunctionsInfo(templateData);
    const customTags = getCustomTags(fileData);

    return `${functionsInfo.summary}${functionsInfo.functions}`
}

const renderDocForClass = (templateData, fileData) => {
    const classData = getClassData(templateData)
    const classInfo = getDocsForClass(classData, fileData);
    const customTags = getCustomTags(fileData);
    const classConstructor = templateData.find(item => item.kind == 'constructor')
    const functions = templateData.filter(item => isFunctionScope(item) && isFunctionKind(item))
    const functionsInfo = getFunctionsInfo(functions);
    const constructorInfo = getConstructorInfo(classConstructor)

    return `${classInfo}${customTags}${constructorInfo}${functionsInfo.summary}${functionsInfo.functions}`
}

module.exports = (file) => {

    const templateData = jsdoc2md.getTemplateDataSync({
        files: file,
        'no-cache': true,
    })

    const fileData = getFileData(file)
    if (!templateData || !templateData.length) return

    const isClass = templateData.some(item => item.kind === 'class');
    if (!isClass) return renderDocsForFiles(templateData, fileData);
    return renderDocForClass(templateData, fileData)
}