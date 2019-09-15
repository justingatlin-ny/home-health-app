const fs = require('fs');
const path = require("path");

let dotEnvPath = path.resolve(__dirname, '../', '.env');

let dotEnvExists = fs.existsSync(dotEnvPath);
if (!dotEnvExists) {
  dotEnvPath = path.resolve('.env');
  dotEnvExists = fs.existsSync(dotEnvPath);
}

if (!dotEnvExists) {
  throw `No .env file exists here or could not be read: ${dotEnvPath}`;
}
const dotEnvFile = fs.readFileSync(dotEnvPath, 'utf8') || '';

const lineRE = /\r?\n/;
const dotEnvLinesArr = dotEnvFile.split(lineRE);

dotEnvLinesArr.forEach(line => {
  const lineArr = line.split('=');
  const key = lineArr[0];
  const value = lineArr[1];
  process.env[key] = value;
});
