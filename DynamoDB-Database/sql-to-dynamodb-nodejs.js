const AWS = require('aws-sdk');
const table = "ip_count_kinesis_stream_example";
const docClient = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (event, context) => {
    // let success = 0;
    // let failure = 0;
    const output = await Promise.all(event.records.map(async record => {
        /* Data is base64 encoded, so decode here */
        const recordData = Buffer.from(record.data, 'base64');
        const data_item = JSON.parse(recordData);
        
        try {
            // Creating a DynamoDB Object
            var opt = {
                TableName: "ip_count_kinesis_stream_example",
                Key:{
                    "ip":{S: data_item['IP']},
                },
                UpdateExpression:"SET Arrival_Time = :val1, Max_Count = if_not_exists(Max_Count, :start) + :inc, Positive = if_not_exists(Positive, :start) + :pos, Negative = if_not_exists(Negative, :start) + :neg",
                
                ExpressionAttributeValues:{
                    ":val1":{S: data_item['ARRIVAL_TIME']},
                    ":inc":{N: data_item['STATUSCOUNT'].toString()},
                    ":start":{N: "0"},
                    ":pos":{N: data_item['POS'].toString()},
                    ":neg":{N: data_item['NEG'].toString()},
                },
                ReturnValues:"UPDATED_NEW"
            };
            
            // Adding it to the table
            await docClient.updateItem(opt).promise();
            
            //Error checking 
            // success++;
            return {
                recordId: record.recordId,
                result: 'Ok',
            };
        } catch (err) {
            console.trace();
            // failure++;
            return {
                recordId: record.recordId,
                result: 'DeliveryFailed',
            };
        }
    }));
    // console.log(`Successful delivered records ${success}, Failed delivered records ${failure}.`);
    return { records: output };
};

// Used Promise.all with async await
// Even number types had to be converted to strings
