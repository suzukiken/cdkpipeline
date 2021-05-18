import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from "@aws-cdk/aws-sqs";
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class CdkpipelineStack extends cdk.Stack {

  public readonly queueUrlOutput: cdk.CfnOutput;
  public readonly tableNameOutput: cdk.CfnOutput;
 
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Dynamo DB
    
    const table = new dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    // Queue

    const queue = new sqs.Queue(this, "Queue", {
      retentionPeriod: cdk.Duration.minutes(10),
      visibilityTimeout: cdk.Duration.seconds(15),
    })
    
    // Lambda
    
    const consume_handler = new lambda.Function(this, 'Consumer', {
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

    queue.grantConsumeMessages(consume_handler)
    table.grantReadWriteData(consume_handler)

    // output
    
    this.queueUrlOutput = new cdk.CfnOutput(this, 'QueueUrl', {
      value: queue.queueUrl,
    })
    
    this.tableNameOutput = new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
    })
  }
}
