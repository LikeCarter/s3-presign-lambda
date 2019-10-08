// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

const AWS = require('aws-sdk')
const s3 = new AWS.S3()


// presignedUrl expires in 1 day

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
    
    const put_url = s3.getSignedUrl('putObject', {
        Bucket: 'docx-2adc98bd-1daf-482a-8834-82eaa638da74',
        Key: 'test.docx',
        Expires: 15
    })

    const get_url = s3.getSignedUrl('getObject', {
        Bucket: 'scrubbed-docx-2adc98bd-1daf-482a-8834-82eaa638da74',
        Key: 'test.docx',
        Expires: 15
    })
    
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world',
                presigned_put: put_url,
                presigned_get: get_url
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
