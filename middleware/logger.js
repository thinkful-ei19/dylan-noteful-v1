'use strict';

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

const logger = (req, res, next) => {
  const now = new Date();
  const time = formatAMPM(now);
  console.log(`${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()} ${time} ${req.method} ${req.url}`);
  next();
};

module.exports = logger;

