const Logger = require("./Logger");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      Logger.warn(`Retry #${attempt} failed. Retrying in ${delay}ms...`);
      await sleep(delay);
      delay *= 2;
    }
  }
}

module.exports = {
  retryWithBackoff,
  sleep
};
