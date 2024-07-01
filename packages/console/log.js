const utils = require('./utils');
module.exports = {
  log(text) {
    console.log(text)
  },
  error: (msg) => {
    console.log(utils.red(`❌ ${msg}`));
  },
  success: (msg) => {
    console.log(utils.green(`✅ ${msg}`));
  },
  info: (text) => {
    console.log(utils.blue(text));
  },
  logErrorExpected: (title, body) => {
    console.log('');
    console.log(
      '\n-------------------------------------------------------------------',
    );
    console.log(utils.red(`❌ ${title}`));
    console.log(utils.underscore('Expected: '));
    console.log(body);
    console.log(
      '-------------------------------------------------------------------\n',
    );
  },
};
