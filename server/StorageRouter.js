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
      const s3 = s3Manager.init();

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
  upload: async uploadParamsList => {
    try {
      const s3 = s3Manager.init();
      const acc2 = [];
      const uploadResult = await uploadParamsList.reduce(
        async (acc, uploadParams) => {
          const result = await s3.upload(uploadParams).promise();
          console.info("s3Manager.upload", typeof acc, result.Key);
          acc2.push(result);
          return acc;
        },
        []
      );

      return { status: 200, acc2 };
    } catch (err) {
      console.error("s3Manager.upload", err);
      return { status: 500, err };
    }
  }
};

StorageRouter.get("/", async (req, res) => {
  const result = await s3Manager.getFiles();
  res.status(result.status).send(result.result || result.err);
});

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

    const fileStreamList = files.reduce((acc, file) => {
      const fileStream = fs.createReadStream(
        path.resolve("uploads", file.filename)
      );

      fileStream.on("error", function(err) {
        console.log("File Error", err);
        return acc;
      });

      const uploadParams = {
        Bucket: "site-document-collection",
        Key: file.filename,
        Body: fileStream
      };

      acc.push(uploadParams);

      return acc;
    }, []);

    const result = await s3Manager.upload(fileStreamList);

    res.status(200).send(result);
  }
);

export default StorageRouter;
