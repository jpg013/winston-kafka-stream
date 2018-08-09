# winston-kakfa-stream

A streaming transport for [winston](https://github.com/winstonjs/winston) which logs messages to a kafka topic. Winston-kafka-stream streams messages from to kafka using the the kafka-node producerStream module (https://github.com/SOHU-Co/kafka-node/blob/master/lib/producerStream.js).

## Install
```
npm install winston-kafka-stream
```

## Options
The WinstonKafkaStream transport accepts the following options:

* `kafkaHost` : A string of kafka broker/host combination delimited by comma for example: `kafka-1.us-east-1.myapp.com:9093,kafka-2.us-east-1.myapp.com:9093,kafka-3.us-east-1.myapp.com:9093` default: `localhost:9092`.
* `options`: options for producer,

```js
{
   // Configuration for when to consider a message as acknowledged, default 1
   requireAcks: 1,
   // The amount of time in milliseconds to wait for all acks before considered, default 100ms
   ackTimeoutMs: 100,
   // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
   partitionerType: 2
}
```

## Usage
``` js
  const { createLogger, transports } = require('winston');

  require('winston-kafka-stream');

  const logger = createLogger({
    level: 'info',
    transports: [
      new transports.KafkaStream({
        kafkaHost: '127.0.0.1:9092',
        producer: {
          topic: 'testTopic'
        }
      })
    ]
  });

  logger.info('Hello world!');
```

## LICENSE
MIT

##### AUTHOR: [Justin Graber](https://github.com/jpgraber)
