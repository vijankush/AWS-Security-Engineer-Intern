import boto3
import json
import re
import io
from pprint import pprint

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ip_count')

def lambda_handler(event, context):
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    s3_file_name = event['Records'][0]['s3']['object']['key']
    
    response = s3_client.get_object(Bucket=bucket_name,Key=s3_file_name)
    response = response['Body'].read().decode("utf-8")
    items = json.loads(response)

    for obj in items:
        for key, value in obj.items():
            if (key == 'ip'):
                value = (value[1:-1])
                table.update_item(
                    Key={
                        'ip': value,
                    },
                    UpdateExpression="SET max_count = if_not_exists(max_count, :start) + :inc",
                    
                    ExpressionAttributeValues={
                        ':inc': 1,
                        ':start': 0,
                    },
                    ReturnValues="UPDATED_NEW"
                )
