import boto3
import botocore
import os

TABLENAME = os.environ.get('TABLENAME')

config = botocore.config.Config(retries={'max_attempts': 10, 'mode': 'standard'})
resource = boto3.resource('dynamodb', config=config)
table = resource.Table(TABLENAME)

response = table.scan()