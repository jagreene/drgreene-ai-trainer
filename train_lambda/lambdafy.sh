#!/bin/bash

source ./config-lambda.sh
if [[ -n "$funcARN" ]]; then
  pip3 install -r requirements.txt -t ./
  zip -r lambda.zip ./
  aws lambda update-function-code --function-name $funcARN --zip-file fileb://lambda.zip
else
  echo "please input lambda function name"
fi
