const AWS = require("aws-sdk");
// name of your bucket here
const NAME_OF_BUCKET = "zhihong-capstone";

const multer = require("multer");

//  make sure to set environment variables in production for:
//  AWS_ACCESS_KEY_ID
//  AWS_SECRET_ACCESS_KEY
//  and aws will automatically use those environment variables

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "jfif"];

const allowedFile = (filename) => {
  if (filename.includes('.')) {
    const nameList = filename.split('.')
    if ( ALLOWED_EXTENSIONS.includes(nameList[nameList.length - 1].toLowerCase())) {
      return true
    }

  }
  return false

}

// --------------------------- Public UPLOAD ------------------------

const singlePublicFileUpload = async (file) => {
  const { originalname, mimetype, buffer } = await file;
  const path = require("path");
  // name of the file in your S3 bucket will be the date in ms plus the extension name
  const Key = new Date().getTime().toString() + path.extname(originalname);
  const uploadParams = {
    Bucket: NAME_OF_BUCKET,
    Key,
    Body: buffer,
    ACL: "public-read",
  };
  const result = await s3.upload(uploadParams).promise();

  // save the name of the file in your bucket as the key in your database to retrieve for later
  return result.Location;
};


// --------------------------- Storage ------------------------

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
      callback(null, "");
    },
  });

  const singleMulterUpload = (nameOfKey) =>
    multer({ storage: storage }).single(nameOfKey);




    module.exports = {
        s3,
        singlePublicFileUpload,
        singleMulterUpload,
        allowedFile
      };
