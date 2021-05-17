import json
import requests

def lambda_handler(event, context):
    print(event)
    
    requests.get('https://www.google.com')
    
    return {
        "body": "Hello from a Lambda Function",
        "statusCode": 200,
    }
