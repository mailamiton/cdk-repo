# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * 
Command To Run After cdk Deloy and formation of cluster :-

kubectl get nodes
cd scripts/
ls ingres-alb.sh
chmod +x ingres-alb.sh
INSTANCE_ROLE=$(aws cloudformation describe-stack-resources --stack-name EksStack | jq .StackResources[].PhysicalResourceId | grep EksStack-ClusterNodegroupcustomnodegroupNodeGroup | tr -d '["\r\n]')
CLUSTER_NAME=$(aws cloudformation describe-stack-resources --stack-name EksStack | jq '.StackResources[] | select(.ResourceType=="Custom::AWSCDK-EKS-Cluster").PhysicalResourceId' | tr -d '["\r\n]')
echo "INSTANCE_ROLE = " $INSTANCE_ROLE 
echo "CLUSTER_NAME = " $CLUSTER_NAME

./ingres-alb.sh $AWS_REGION $INSTANCE_ROLE $CLUSTER_NAME
