// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

const AWS = require("aws-sdk");
const s3 = new AWS.S3({ signatureVersion: "v4", region: "us-east-1" });

// presignedUrl expires in 1 day


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
    if (event.body !== null && event.body !== "" && event.body !== undefined) {
        let body = JSON.parse(event.body);
        let name = body.name;

        const put_url = s3.getSignedUrl("putObject", {
            Bucket: "docx-2adc98bd-1daf-482a-8834-82eaa638da74",
            Key: uuidv4() + "/" + name,
            Expires: 300 // 5 minutes
        });

        const get_url = s3.getSignedUrl("getObject", {
            Bucket: "scrubbed-docx-2adc98bd-1daf-482a-8834-82eaa638da74",
            Key: uuidv4() + "/" + name,
            Expires: 300
        });

        try {
            // const ret = await axios(url);
            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*" // Necessary to allow CORS
                },
                body: JSON.stringify({
                    message: "hello world",
                    presigned_put: put_url,
                    presigned_get: get_url
                })
            };
        } catch (err) {
            console.log(err);
            return err;
        }

        return response;
    } else {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*" // Necessary to allow CORS
            },
            body: JSON.stringify({
                message: "Malformed body."
            })
        };
    }
};
