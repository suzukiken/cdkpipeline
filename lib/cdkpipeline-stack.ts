import * as cdk from '@aws-cdk/core';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import { PythonFunction } from '@aws-cdk/aws-lambda-python';

export class CdkpipelineStack extends cdk.Stack {
  
  public readonly urlOutput: cdk.CfnOutput;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const handler = new PythonFunction(this, "Func", {
      entry: "lambda",
      index: "main.py",
      handler: "lambda_handler",
      runtime: lambda.Runtime.PYTHON_3_8
    })

    const gw = new apigw.LambdaRestApi(this, 'Gateway', {
      description: 'Endpoint for a simple Lambda-powered web service',
      handler,
    })

    this.urlOutput = new cdk.CfnOutput(this, 'Url', {
      value: gw.url,
    })
  }
}