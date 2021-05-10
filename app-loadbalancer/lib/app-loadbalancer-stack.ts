import * as cdk from '@aws-cdk/core';
import * as autoscaling from '@aws-cdk/aws-autoscaling'
import * as ec2 from  '@aws-cdk/aws-ec2'
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2'


export class AppLoadbalancerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, 'VPC');
    const linux = new ec2.GenericLinuxImage({
      'eu-north-1': 'ami-05dcbf8b36d111036'
    });

    const mySG = new ec2.SecurityGroup(this, '${stack}-ssh-app', {
        vpc: vpc,
        allowAllOutbound: true,
        description: 'Security Group '
    });

    mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH frm anywhere');
    mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'For Application Deployment');
    mySG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3000), 'For Application Deployment');
    //mySG.addIngressRule(ec2.Peer.ipv4('10.200.0.0/24'), ec2.Port.tcp(80), 'Redshift Ingress1');

    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: linux,
      keyName : 'vanir3rd',
      minCapacity: 1,
      maxCapacity: 5
    });
    asg.addSecurityGroup(mySG)

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true
    });

    const listener = lb.addListener('Listener', {
      port: 80,
    });

    listener.addTargets('Target', {
      port: 80,
      targets: [asg]
    });

    listener.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    asg.scaleOnRequestCount('AModestLoad', {
      targetRequestsPerSecond: 1
    });
  }
}
