import boto3
import botocore
import os
import uuid

TABLENAME = os.environ.get('TABLENAME')

config = botocore.config.Config(retries={'max_attempts': 10, 'mode': 'standard'})
resource = boto3.resource('dynamodb', config=config)
table = resource.Table(TABLENAME)

def lambda_handler(event, context):
    
    print(event)
    
    uuid.uuid1()
    
    item = {
        'id': str(uuid.uuid1()),
        'value': 'hello'
    }
    response = table.put_item(Item=item)
