## Description

Code to reproduce https://github.com/guidesmiths/rascal/issues/156

Steps:

1. update `adhoc/rmq-publisher.js` to provide password for Amazon MQ`
1. run `npm install`
1. run `DEBUG=rascal:* node adhoc/rmq-publisher.js`
1. restart AMQ cluster (via AWS console)
1. wait for the cluster to get restarted indicated by

```
Handling connection error: Connection closed: 320 (CONNECTION-FORCED) with message "CONNECTION_FORCED - broker forced connection closure with reason 'shutdown'" initially from connection: 2e494af6-b83c-4253-8f2c-3ba62aab109d, amqps://rascal:***@b-f6fe758b-07f7-4afa-b0ae-302212d604c3.mq.us-west-2.amazonaws.com:5671?heartbeat=10&connection_timeout=10000&channelMax=100 +7s
RabbitBroker (rascal) - error Error: Connection closed: 320 (CONNECTION-FORCED) with message "CONNECTION_FORCED - broker forced connection closure with reason 'shutdown'
```

(tested with Node.js v14.16.0)
