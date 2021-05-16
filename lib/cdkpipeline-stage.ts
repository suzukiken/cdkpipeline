import * as cdk from '@aws-cdk/core';
import { CdkpipelineStack } from './cdkpipeline-stack';

export class CdkpipelineStage extends cdk.Stage {
  public readonly urlOutput: cdk.CfnOutput;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const service = new CdkpipelineStack(this, 'WebService');
    
    this.urlOutput = service.urlOutput;
  }
}