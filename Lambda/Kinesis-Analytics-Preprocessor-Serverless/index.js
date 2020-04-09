/*
An Amazon Kinesis Analytics record pre-processor that receives kinesis records as input and returns them as a JSON Object with a processing status. Use this processor as a starting point for custom transformation logic in Kinesis Analytics.
*/

const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    /* Process the list of records */
    const output = event.records.map((record) => {
        const recordData = Buffer.from(record.data, 'base64').toString('utf-8');
        try {
            var elements = recordData.split(/(\[.+?])/);
            var obj = new Object();
            obj.verb = elements[1].slice(1,-1);
            obj.ip  = elements[3].slice(1,-1);
            obj.thread = elements[5].slice(1,-1);
            obj.system = elements[7].slice(1,-1);
            obj.timestamp = elements[9].slice(1,-1).trim();
            obj.line = elements[10].trim();
            
            obj = scoringHandler(obj); // Handler fo positive/negative scoring
            
            // converts json to base64
            var jsonString = Buffer.from(JSON.stringify(obj)).toString('base64');

            return {
                recordId: record.recordId,
                result: 'Ok',
                data: jsonString,
            };
        } catch (err) {
            console.trace();
            return {
                recordId: record.recordId,
                result: 'DeliveryFailed',
            };
        }
    }
    );
    // console.log(`Processing completed.  Successful records ${output.length}.`);
    callback(null, { records: output });
};

function scoringHandler(obj) {
    if (!obj.line.includes("Completed")) {
                obj.positive = 0;
                obj.negative = 0;
        } else {
            if (obj.line.toLowerCase().includes("error")) {
                obj.positive = 0;
                obj.negative = 1;
            } else {
                obj.positive = 1;
                obj.negative = 0;
            }
        }
    return obj;
}
