import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
// import { PythonFunction } from '@aws-cdk/aws-lambda-python';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';

export class CdkpipelineStack extends cdk.Stack {

  public readonly urlOutput: cdk.CfnOutput;
  public readonly urlPyOutput: cdk.CfnOutput;
 
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
    
    const python_handler = new lambda.Function(this, 'PythonLambda', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
      handler: 'main.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_8,
    })
    
    const node_handler = new lambda.Function(this, 'NodeLambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
    })
    
    const python_gw = new apigw.LambdaRestApi(this, 'PythonGateway', {
      description: 'Endpoint for a simple Python Lambda-powered web service',
      handler: python_handler,
    })
    
    const node_gw = new apigw.LambdaRestApi(this, 'NodeGateway', {
      description: 'Endpoint for a simple Node Lambda-powered web service',
      handler: node_handler,
    })
    
    this.urlPyOutput = new cdk.CfnOutput(this, 'PythonUrl', {
      value: python_gw.url,
    });

    this.urlOutput = new cdk.CfnOutput(this, 'NodeUrl', {
      value: node_gw.url,
    });
  }
}