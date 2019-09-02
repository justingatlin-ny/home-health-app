import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";

const StorageRouter = express.Router();

import aws from "aws-sdk";

import aws_config from "../aws-config";

const s3Manager = {
  init: () => {
    aws.config.setPromisesDependency();

    aws.config.update({
      accessKeyId: aws_config.accessKeyId,
      secretAccessKey: aws_config.secretAccessKey,
      region: aws_config.region
    });

    return new aws.S3();
  },
  getFiles: async () => {
    try {
      const s3 = this.init();

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

      return { status: 200, result: documentsList };
    } catch (err) {
      return { status: 400, err };
    }
  },
  upload: async uploadParams => {
    try {
      const s3 = this.init();
      const result = await s3.upload(uploadParams).promise();
      return { status: 200, result };
    } catch (err) {
      return { status: 500, err };
    }
  }
};

StorageRouter.get("/", async (req, res) => {
  const result = await s3Manager.getFiles();
  res.status(result.status).send(result.result || result.err);
});

// Example upload object
// destination { fieldname: 'fileList',
//   originalname: '2018-05-25_21-34-42_000.jpeg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg' }
// filename { fieldname: 'fileList',
//   originalname: '2018-05-25_21-34-42_000.jpeg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg' }

const storage = multer.diskStorage({
  destination: (req, file, instructions) => {
    // console.log("destination", file);
    instructions(null, "uploads");
  },
  filename: (req, file, instructions) => {
    // console.log("filename", file);
    instructions(null, `${file.fieldname}-${Date.now()}`);
  }
});

const upload = multer({ storage });

StorageRouter.post(
  "/upload",
  upload.array("fileList", 12),
  async (req, res, next) => {
    const { files } = req;

    if (!files) {
      return res.status(404).send("no files");
    }

    const result = await files.reduce(async (acc, file) => {
      // return res.status(200).send(file);
      const fileStream = fs.createReadStream(
        path.resolve("uploads", file.filename)
      );

      fileStream.on("error", function(err) {
        console.log("File Error", err);
        return res.status(500).send(err);
      });

      const uploadParams = {
        Bucket: "site-document-collection",
        Key: file.filename,
        Body: fileStream
      };

      acc.push(await s3Manager.upload(uploadParams));
      return acc;
    }, []);

    res.status(200).send(result);
  }
);

export default StorageRouter;
