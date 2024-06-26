const { format } = require('date-fns');

const dateFormat = (date) => format(date, 'yyyy-MM-dd HH:mm:ss');

module.exports = dateFormat;