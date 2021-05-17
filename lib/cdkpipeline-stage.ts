import * as cdk from '@aws-cdk/core';
import { CdkpipelineStack } from './cdkpipeline-stack';

export class CdkpipelineStage extends cdk.Stage {

  public readonly apiUrlOutput: cdk.CfnOutput;
  public readonly queueUrlOutput: cdk.CfnOutput;
  public readonly tableNameOutput: cdk.CfnOutput;
 
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const service = new CdkpipelineStack(this, 'WebService');
    
    this.apiUrlOutput = service.apiUrlOutput;
    this.queueUrlOutput = service.queueUrlOutput;
    this.tableNameOutput = service.tableNameOutput;
  }
}