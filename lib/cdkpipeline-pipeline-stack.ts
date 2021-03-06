import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as cdk from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction, ShellScriptAction } from "@aws-cdk/pipelines";
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as iam from '@aws-cdk/aws-iam';
import { CdkpipelineStage } from './cdkpipeline-stage';

export class CdkpipelinePipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = this.node.tryGetContext('github-repository-name');
    const owner = this.node.tryGetContext('github-owner-name');
    const branch = this.node.tryGetContext('github-branch-name');
    const smname = this.node.tryGetContext('github-connection-codestararn-smname');
    const codestararn = secretsmanager.Secret.fromSecretNameV2(this, 'secret', smname).secretValue.toString();
    
    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();
    
    const source_action = new codepipeline_actions.BitBucketSourceAction({
      actionName: 'GitHub',
      owner: owner,
      repo: repository,
      branch: branch,
      connectionArn: codestararn,
      output: sourceArtifact,
    })
    
    const pipeline = new CdkPipeline(this, 'Pipeline', {
      crossAccountKeys: false,
      pipelineName: 'CdkpipelinePipeline',
      cloudAssemblyArtifact,
      sourceAction: source_action,
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        buildCommand: 'npm run build'
      }),
    })
    
    // CDK deploy
    
    const preprod = new CdkpipelineStage(this, 'PreProd', {
      env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION }
    })

    const preprodStage = pipeline.addApplicationStage(preprod)
    
    // test the queue deployment
    
    preprodStage.addActions(new ShellScriptAction({
      actionName: 'SqsToDynamoTest',
      additionalArtifacts: [sourceArtifact], // include test-sqs2dynamo.py
      useOutputs: {
        QUEUE_URL: pipeline.stackOutput(preprod.queueUrlOutput),
        TABLE_NAME: pipeline.stackOutput(preprod.tableNameOutput),
      },
      commands: [
        'python test/test-sqs2dynamo.py'
      ],
      rolePolicyStatements: [
        new iam.PolicyStatement({
          actions: ['sqs:*'],
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: ['dynamodb:Scan'],
          resources: ['*'],
        }),
      ]
    }))
  }
}
