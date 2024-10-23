const fs = require('fs');
const path = require('path');

class Metrics {
  constructor() {
    this.filePath = path.join(__dirname, 'metrics.json');
    this.metrics = {};
    this.loadMetricsFromFile();
  }

  loadMetricsFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.metrics = JSON.parse(data);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error reading metrics file:', error);
      }
      // If file doesn't exist or is invalid, start with an empty object
      this.metrics = {};
    }
  }

  saveMetricsToFile() {
    const data = JSON.stringify(this.metrics, null, 2);
    fs.writeFileSync(this.filePath, data, 'utf8');
  }

  incrementCommandCount(chatId, command) {
    const today = new Date().toISOString().split('T')[0];
    if (!this.metrics[chatId]) {
      this.metrics[chatId] = {};
    }
    if (!this.metrics[chatId][today]) {
      this.metrics[chatId][today] = {};
    }
    if (!this.metrics[chatId][today][command]) {
      this.metrics[chatId][today][command] = 0;
    }
    this.metrics[chatId][today][command]++;
    this.saveMetricsToFile();
  }

  getMetrics() {
    return this.metrics;
  }
}

module.exports = { Metrics };