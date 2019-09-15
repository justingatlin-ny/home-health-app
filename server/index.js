import path from "path";
import fs from 'fs';
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import http from 'http';
import https from 'https';

const app = express();

import StorageRouter from "StorageRouter";

const isDevelopment = (process.env.NODE_ENV === 'development');
const folder = isDevelopment ? 'dev' : 'build';

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(folder, "public")));
app.use("/storage", StorageRouter);

// File not found
app.use("*", (req, res) => {
  res.sendStatus(404);
});

let key, cert, ca, credentials = {};

// Certificate
if (isDevelopment) {
  key = fs.readFileSync('creds/https.key', 'utf8');
  cert = fs.readFileSync('creds/https.crt', 'utf8');
} else {
  key = fs.readFileSync('creds/privkey.pem', 'utf8');
  cert = fs.readFileSync('creds/cert.pem', 'utf8');
  ca = fs.readFileSync('creds/chain.pem', 'utf8');

  credentials.ca = ca;
}

credentials.cert = cert;
credentials.key = key;

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const port = process.env.PORT;
const secureport = process.env.SECURE_PORT;


httpServer.listen(port, () => {
	console.log(`HTTP Server running on port: ${port}` );
});

httpsServer.listen(secureport, () => {
	console.log(`HTTPS Server running on port: ${secureport} `);
});
