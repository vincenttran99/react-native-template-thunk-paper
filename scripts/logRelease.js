const fs = require('fs');
const path = require('path');

// Get log content from command line parameters
const logContent = process.argv[2];

if (!logContent) {
  console.error("Missing log content. Usage: node log_release.js \"<log content>\"");
  process.exit(1);
}

//Read JSON file content
const logFilePath = path.join(__dirname, "releaseLogs.json");
let releaseLog = [];
try {
  releaseLog = require(logFilePath);
} catch (err) {
  // The file does not exist or cannot be read, a new empty array will be created
}

// Add a new record
const newLogEntry = {
  content: logContent,
  date: new Date().toLocaleTimeString("en-US") + " " + new Date().toLocaleDateString("en-US")
};
releaseLog = [newLogEntry, ...releaseLog];

// Record to JSON file
fs.writeFileSync(logFilePath, JSON.stringify(releaseLog, null, 2));

console.log('Log release saved successfully.');
