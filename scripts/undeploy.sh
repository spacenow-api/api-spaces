#!/usr/bin/env bash
usage="Usage: $(basename "$0") region environment
where:
  region       - the AWS region
  stack-name   - AWS Environment (dev,test,prod)
"

if [ "$1" == "-h" ] || [ "$1" == "--help" ] || [ "$1" == "help" ] || [ "$1" == "usage" ] ; then
  echo "$usage"
  exit -1
fi

if [ -z "$1" ] || [ -z "$2" ] ; then
  echo "$usage"
  exit -1
fi

# region=ap-southeast-2
region=$1
stack_name=node-sample'-'$2
set -eo pipefail

echo 'Preparing to delete the AWS Stack ' $stack_name
aws cloudformation delete-stack --stack-name=$stack_name
echo 'Stack ' $stack_name ' has been deleted'
