import json

def lambda_handler(event, context):
    print(event)
    
    return {
        "body": json.dumps('Hello from a Lambda Function'),
        "statusCode": 200,
    }
