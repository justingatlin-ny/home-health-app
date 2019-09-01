import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";

const StorageRouter = express.Router();

import aws from "aws-sdk";

import aws_config from "../aws-config";

const s3List = async res => {
  try {
    aws.config.setPromisesDependency();

    aws.config.update({
      accessKeyId: aws_config.accessKeyId,
      secretAccessKey: aws_config.secretAccessKey,
      region: aws_config.region
    });

    const s3 = new aws.S3();

    const response = await s3
      .listObjectsV2({
        Bucket: "site-document-collection",
        Prefix: "private-documents"
      })
      .promise();
    const contentsList = response.Contents;
    const documentsList = contentsList.reduce((acc, item) => {
      if (!/\/$/.test(item.Key)) {
        acc.push(item.Key);
      }
      return acc;
    }, []);

    res.status(200).send(JSON.stringify(documentsList));
  } catch (err) {
    console.error("aws error", err);
  }
};

const s3Upload = async (res, uploadParams) => {
  try {
    aws.config.setPromisesDependency();

    aws.config.update({
      accessKeyId: aws_config.accessKeyId,
      secretAccessKey: aws_config.secretAccessKey,
      region: aws_config.region
    });

    const s3 = new aws.S3();

    const response = await s3.upload(uploadParams).promise();

    // const contentsList = response.Contents;
    // const documentsList = contentsList.reduce((acc, item) => {
    //   if (!/\/$/.test(item.Key)) {
    //     acc.push(item.Key);
    //   }
    //   return acc;
    // }, []);

    res.status(200).send(JSON.stringify(response));
  } catch (err) {
    console.error("aws error", err);
    res.status(500).send(JSON.stringify(err));
  }
};

StorageRouter.get("/", (req, res) => {
  s3List(res);
});

const storage = multer.diskStorage({
  destination: (req, file, instructions) => {
    instructions(null, "uploads");
  },
  filename: (req, file, instructions) => {
    instructions(null, `${file.fieldname}-${Date.now()}`);
  }
});

const upload = multer({ storage });

StorageRouter.post(
  "/upload",
  upload.array("fileList", 12),
  (req, res, next) => {
    const { files } = req;

    if (!files) {
      return res.status(404).send("no files");
    }

    files.forEach(file => {
      const fileStream = fs.createReadStream(
        path.resolve("uploads", file.filename)
      );

      fileStream.on("error", function(err) {
        console.log("File Error", err);
        return res.sendStatus(401);
      });

      const uploadParams = {
        Bucket: "site-document-collection",
        Key: file.originalname,
        Body: fileStream
      };

      s3Upload(res, uploadParams);
    });

    res
      .status(200)
      .send(`${files.length} file${files.length === 1 ? "" : "s"} uploaded`);
  }
);

export default StorageRouter;
