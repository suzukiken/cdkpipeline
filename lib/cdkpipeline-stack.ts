import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
// import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';

export class CdkpipelineStack extends cdk.Stack {

  public readonly urlOutput: cdk.CfnOutput;
 
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    /*
    const handler = new PythonFunction(this, "Handler", {
      entry: "lambda",
      index: "main.py",
      handler: "lambda_handler",
      runtime: lambda.Runtime.PYTHON_3_8
    })
    */
    
    new lambda.Function(this, 'Python', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
      handler: 'main.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_8,
    })
    
    const handler = new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
    })
    
    const gw = new apigw.LambdaRestApi(this, 'Gateway', {
      description: 'Endpoint for a simple Lambda-powered web service',
      handler,
    });

    this.urlOutput = new cdk.CfnOutput(this, 'Url', {
      value: gw.url,
    });
  }
}