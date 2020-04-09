// dependencies
'use strict';
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var docClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (event, context, callback) => {
    AWS.config.update({ region: 'us-east-1' });
    // TODO implement
    let statusCode = 0;
    let responseBody = '';
    
    const { name } = event.Records[0].s3.bucket;  
    const { key } = event.Records[0].s3.object;
    
    const params = {
        Bucket: name,
        Key: key
    }
    let s3Data = await s3.getObject(params).promise();
    s3Data = s3Data.Body.toString();
    var usersJSON = JSON.parse(s3Data);
    
    await Promise.all(usersJSON.map(async (users) => {
        // console.log(users['ip']);
        const params = {
          TableName: 'ip_count',
          Key: {
            'ip': {S: users['ip']},
          },
          UpdateExpression: 'set count = :c',
          ExpressionAttributeValues: {
            ':c' : {N: 1}
          },
          ReturnValues: 'UPDATED_NEW'
        }
    
        try {
          await docClient.updateItem(params).promise()
        } catch (e) {
          console.log(e.message)
        }
    }))
    
    responseBody = "Succeeded";
    statusCode = 201;
    
    const response = {
        statusCode: statusCode,
        body: responseBody
    }
    
    return response;

};
