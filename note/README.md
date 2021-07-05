+++
title = "CDK Pipeline"
date = "2021-05-18"
tags = ["CDK Pipeline"]
+++

CDKで作ったものをテストするにはどうしたらいいかと考えていて、CIのような仕組みがそれに使えるかもしれないと思ってCDK Pipelineを使ってみた。

CDK Pipelineとは何かというと、自分の適当な解釈では、CDKのスタックをCodePipelineのステージに組み込むための便利なモジュールで、デプロイされたリソースをテストすることもできる。

今回試しに作ったのは

* SQS
* Lambda
* Dynamoのテーブル

で、SQSのメッセージをLambdaが取り込むたびにテーブルにレコードを追加する仕組み。

テスト内容はSQSにメッセージを投稿したらDynamoにレコードが1行増えるかをチェックするもの。

[Githubのリポジトリ](https://github.com/suzukiken/cdkpipeline)

CDKのドキュメントではテストの方法はコマンドラインやShellスクリプトを呼ぶサンプルになっていたけど、Pythonを使うことができるしBoto3も利用できることがわかった。