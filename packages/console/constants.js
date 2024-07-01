/*
* https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
* https://web.archive.org/web/20210226122732/http://ascii-table.com/ansi-escape-sequences.php
* https://stackoverflow.com/questions/4842424/list-of-ansi-color-escape-sequences
*/
// CODES

module.exports = {
  color_blue: '\x1b[38;5;33m',
  color_red: '\x1b[31m',
  color_green: '\x1b[38;5;41m',
  color_yellow: '\x1b[38;5;220m',
  color_orange: '\x1b[38;5;202m',
  style_bold: '\x1b[1m',
  style_italic: '\x1b[3m',
  style_underscore: '\x1b[4m'
};
