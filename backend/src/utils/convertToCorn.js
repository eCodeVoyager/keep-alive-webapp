const ms = require("ms");

const convertToCron = (interval) => {
  const msValue = ms(interval);

  if (!msValue) {
    throw new Error(
      "Invalid interval format. Use formats like '1m', '10m', '1hr 29m'."
    );
  }

  const minutes = Math.floor(msValue / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `*/${remainingMinutes} * * * *`;
  }

  if (remainingMinutes === 0) {
    return `0 */${hours} * * *`;
  }

  // Run at the specified hour and minute
  return `${remainingMinutes} */${hours} * * *`;
};

module.exports = convertToCron;
