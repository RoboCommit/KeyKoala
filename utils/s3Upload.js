const AWS = require('aws-sdk');

// Configure AWS credentials via environment variables AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
const s3 = new AWS.S3();

/**
 * Upload a file to an S3 bucket
 * @param {string} bucket - S3 bucket name
 * @param {string} key - Destination key in the bucket
 * @param {Buffer} data - File data buffer
 * @param {string} contentType - MIME type
 * @returns {Promise}
 */
module.exports = function uploadToS3(bucket, key, data, contentType) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: contentType,
  };
  return s3.upload(params).promise();
};
