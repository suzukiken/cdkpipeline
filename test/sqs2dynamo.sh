aws sqs send-message --queue-url $QUEUE_URL --message-body hello
sleep 5
aws dynamodb scan --table-name $TABLE_NAME
