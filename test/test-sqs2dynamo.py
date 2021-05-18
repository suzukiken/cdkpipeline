import boto3
import os
import time

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLE_NAME'))

response = table.scan()
beforeCount = response['Count']

sqs = boto3.client('sqs')

response = sqs.send_message(
    QueueUrl=os.environ.get('QUEUE_URL'),
    MessageBody='hello'
)

time.sleep(5)

response = table.scan()
afterCount = response['Count']

assert beforeCount + 1 == afterCount, f'before: {beforeCount} and after: {afterCount}'
