import * as cdk from '@aws-cdk/core';
import ec2 = require('@aws-cdk/aws-ec2');
import eks = require('@aws-cdk/aws-eks');
import iam = require('@aws-cdk/aws-iam');


export class EksStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

     /**
     * Create a new VPC with single NAT Gateway
     */
      const vpcMy = new ec2.Vpc(this, 'NewVPC', {
        cidr: '10.0.0.0/16',
        natGateways: 1
      });
  
      const clusterAdmin = new iam.Role(this, 'AdminRole', {
        assumedBy: new iam.AccountRootPrincipal()
      });
  
      const cluster = new eks.Cluster(this, 'Cluster', {
        vpc : vpcMy,
        defaultCapacity: 0,
        mastersRole: clusterAdmin,
        version: eks.KubernetesVersion.V1_19,
        outputClusterName: true,
      });


      cluster.addNodegroupCapacity('custom-node-group', {
        instanceTypes: [new ec2.InstanceType('t3.micro')],
        minSize: 2,
        diskSize: 10,
        amiType: eks.NodegroupAmiType.AL2_X86_64,
      });
  
  }
}
