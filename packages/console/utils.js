const style = require('./constants');
const endScape = '\x1b[0m';

const names = Object.keys(style);

const format = (constName, text) => {
    if (!names.includes(constName)) {
        const errorMessage = 'Style not allowed. For allowed styles, use one of the following: ' + names.join(', ');
        throw errorMessage
    }

    if(process.env.CI) {
        return text;
    }
    return `${style[constName]}${text}${endScape}`;

}
const fns = {};

names.forEach(name =>{
    const fnName = name.split('_').pop();
    fns[fnName] = (str) => format(name, str);
})



module.exports = { format, ...fns }