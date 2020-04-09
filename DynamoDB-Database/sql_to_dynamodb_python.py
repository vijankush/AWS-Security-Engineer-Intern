# An Amazon Kinesis Analytics application will invoke this function after it has seen determined it has seen all records associated with a
# particular rowtime value.
# If records are emitted to the destination in-application stream with in the Kinesis Analytics application as a tumbling window, this means
# that this function is invoked per tumbling window trigger.
# If records are emitted to the destination in-application stream with in the Kinesis Analytics application as a continuous query or a sliding
# window, this means your Lambda function will be invoked approximately once per second.

# This function requires that the output records of the Kinesis Analytics application has a key identifier (row_id) and rowtimestamp (row_timestamp)
# and the output record format type is specified as JSON.

# A sample output record from Kinesis Analytics application for this function is as below
# {"ROWTIME_TIMESTAMP":"2017-12-15 01:09:50.000","VEHICLEID":"5","VEHICLECOUNT":18}

# Please uncomment the below code as it fit your needs.

import boto3
import base64
import json
from json import loads
import re
import io
from pprint import pprint
import traceback

dynamodb_client = boto3.resource('dynamodb')
table = dynamodb_client.Table('ip_count_kinesis_stream_example')

def lambda_handler(event, context):
    payload = event['records']
    output = []
    success = 0
    failure = 0

    for record in payload:
        try:
            # # This block parses the record, and writes it to the DDB table.
            payload = base64.b64decode(record['data'])
            data_item = loads(payload)
            # for key, value in data_item.items():
            #     print(key, value)
            table.update_item(
                    Key={
                        'ip': data_item['IP'],
                    },
                    UpdateExpression="SET Arrival_Time = :val1, max_count = if_not_exists(max_count, :start) + :inc",
                    
                    ExpressionAttributeValues={
                        ':val1': data_item['ARRIVAL_TIME'],
                        ':inc': data_item['STATUSCOUNT'],
                        ':start': 0,
                    },
                    ReturnValues="UPDATED_NEW"
                )
                
            success += 1
            output.append({'recordId': record['recordId'], 'result': 'Ok'})
        except Exception:
            traceback.print_exc()
            failure += 1
            output.append({'recordId': record['recordId'], 'result': 'DeliveryFailed'})

    # print('Successfully delivered {0} records, failed to deliver {1} records'.format(success, failure))
    return {'records': output}


# The block below creates the DDB table with the specified column names.
'''
table_name =
row_id =
row_timestamp =
count =

try:
    response = dynamodb_client.create_table(
        AttributeDefinitions=[
            {
                'AttributeName': row_id,
                'AttributeType': 'S',
            },
            {
                'AttributeName': row_timestamp,
                'AttributeType': 'S',
            }
        ],
        KeySchema=[
            {
                'AttributeName': row_id,
                'KeyType': 'HASH',
            },
            {
                'AttributeName': row_timestamp,
                'KeyType': 'RANGE',
            },
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5,
        },
        TableName=table_name
    )
except dynamodb_client.exceptions.ResourceInUseException:
    # Table is created, skip
    pass
'''
