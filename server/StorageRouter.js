import http from 'http';
import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

const StorageRouter = express.Router();

import aws from "aws-sdk";

import aws_config from "../aws-config";
import aws_exports from '../src/aws-exports';

const isValid = async (req, res, next) => {
  const { token } = req.headers;
  const aws_jwt_url = `https://cognito-idp.${aws_config.region}.amazonaws.com/${aws_exports.Auth.userPoolId}/.well-known/jwks.json`;

  try {
    const response = await axios.get(aws_jwt_url);
    // console.log(response.data.keys);
    // return res.sendStatus(404);
    const pem = jwkToPem(response.data.keys[0]);
    jwt.verify(token, pem, { algorithms: ['RS256'] }, function(err, decodedToken) {
      if (err) {
        console.error('err', err);
        return res.sendStatus(403);
      }
      // const issuer = `https://cognito-idp.us-east-1.amazonaws.com/${aws_exports.Auth.userPoolId}`
      next();
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
  
}

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
          Prefix: ""
        })
        .promise();

      const fileList = response.Contents;

      const vettedFilesObj = fileList.reduce((acc, file) => {
        const key = file.Key;
        const lastSlash = key.lastIndexOf('/');
        const path = key.substr(0, lastSlash);
        const re = new RegExp('^' + path);
        const filesInPath = fileList.filter(itm => { return re.test(itm.Key); });
        const sortedFiles = filesInPath.sort((a, b) => { if (a.LastModified > b.LastModified) return -1; return 1 });
        if (!acc[path]) {
          acc[path] = sortedFiles[0];
        }
        return acc;
      }, {});
      return { fileObj: vettedFilesObj };
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
          acc2.push(result.Key);
          return acc;
        },
        []
      );

      return { status: 200, resultList: acc2 };
    } catch (err) {
      console.error("s3Manager.upload", err);
      return { status: 500, err };
    }
  }
};

StorageRouter.options("*", cors());

StorageRouter.use(function (err, req, res, next) {
  console.log('This is the invalid field ->', err.field)
  next(err)
})

const getUploadedDocuments = async (req, res, next) => {
  const result = await s3Manager.getFiles();
  const fileList = Object.keys(result.fileObj);
  if (!result.err) {
    if (res) {
      res.app.locals.fileList = fileList;
    } else {
      return fileList;
    }
  } else {
    console.log(result.err);
  }
  next();
};

const storage = multer.diskStorage({
  destination: (req, file, instructions) => {
    instructions(null, "uploads");
  },
  filename: (req, file, instructions) => {
    instructions(null, `${file.originalname}-${Date.now()}`);
  }
});

const upload = multer({ storage });

StorageRouter.post(
  "/upload",
  cors(),
  isValid,
  upload.any(),
  async (req, res, next) => {
    const { files } = req;

    if (!files) {
      return res.status(404).send("no files");
    }

    console.error('files', files);

    const fileStreamList = files.reduce((acc, file) => {
      const fileStream = fs.createReadStream(
        path.resolve("uploads", file.filename)
      );

      fileStream.on("error", function (err) {
        console.log("File Error", err);
        return acc;
      });
      console.log(`${file.fieldname}${file.filename}`);
      const uploadParams = {
        Bucket: "site-document-collection",
        Key: `${file.fieldname}${file.filename}`,
        Body: fileStream
      };

      acc.push(uploadParams);

      return acc;
    }, []);

    const result = await s3Manager.upload(fileStreamList);
    const allFiles = getUploadedDocuments();

    res.status(200).send(allFiles);
  }
);

export { StorageRouter as default, getUploadedDocuments };
