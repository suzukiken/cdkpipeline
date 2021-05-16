import * as cdk from '@aws-cdk/core';
import { CdkpipelinePipelineStack } from '../lib/cdkpipeline-pipeline-stack';

const app = new cdk.App();

new CdkpipelinePipelineStack(app, 'CdkpipelinePipelineStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

app.synth();