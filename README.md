## Description

Code to reproduce https://github.com/guidesmiths/rascal/issues/156

Steps:

1. update `adhoc/rmq-publisher.js` to provide password for Amazon MQ`
1. run `npm install`
1. run `node adhoc/rmq-publisher.js`
1. restart AMQ cluster
```
