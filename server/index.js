import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";

const app = express();
const port = process.env.PORT || 3000;

import StorageRouter from "StorageRouter";

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.resolve("build", "public")));
app.use("/storage", StorageRouter);

// File not found
app.use("*", (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () =>
  console.log(`Example app listening on port http://localhost:${port}`)
);
