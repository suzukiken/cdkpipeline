import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from "@aws-cdk/aws-sqs";
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CdkpipelineStack extends cdk.Stack {

  public readonly apiUrlOutput: cdk.CfnOutput;
  public readonly queueUrlOutput: cdk.CfnOutput;
  public readonly tableNameOutput: cdk.CfnOutput;
 
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // for lambda and apigw test
    const python_handler = new lambda.Function(this, 'PythonLambda', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
      handler: 'api.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_8,
    })
    
    const python_gw = new apigw.LambdaRestApi(this, 'PythonGateway', {
      description: 'Endpoint for a simple Python Lambda-powered web service',
      handler: python_handler,
    })
    
    // Dynamo DB
    
    const table = new dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    // queue

    const queue = new sqs.Queue(this, "queue", {
      retentionPeriod: cdk.Duration.minutes(10),
      visibilityTimeout: cdk.Duration.seconds(15),
    })
    
    // Lambda
    
    const consume_handler = new lambda.Function(this, 'PythonLambda', {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
      handler: 'consumer.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      environment: {
        TABLENAME: table.tableName
      }
    })
    
    consume_handler.addEventSource(
      new SqsEventSource(queue, {
        batchSize: 1
      })
    );

    queue.grantConsumeMessages(consume_handler);

    // output
    
    this.apiUrlOutput = new cdk.CfnOutput(this, 'ApiUrl', {
      value: python_gw.url,
    })

    this.queueUrlOutput = new cdk.CfnOutput(this, 'QueueUrl', {
      value: queue.queueUrl,
    })
    
    this.tableNameOutput = new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
    })
  }
}
