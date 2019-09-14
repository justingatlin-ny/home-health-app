const fs = require('fs');
const path = require("path");

const dotEnvPath = path.resolve(__dirname, '../', '.env');

const dotEnvExists = fs.existsSync(dotEnvPath);
const dotEnvFile = dotEnvExists && fs.readFileSync(dotEnvPath, 'utf8') || '';

const lineRE = /\r?\n/;
const dotEnvLinesArr = dotEnvFile.split(lineRE);

dotEnvLinesArr.forEach(line => {
  const lineArr = line.split('=');
  const key = lineArr[0];
  const value = lineArr[1];
  process.env[key] = value;
});