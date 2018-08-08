const winston         = require('winston');
const semver          = require('semver');
const kafka_client    = require('./lib/kafka-client');
const kafka           = require('kafka-node');
const Transport       = require('winston-transport');
const noop            = require('./lib/noop');
const MESSAGE         = require('triple-beam').MESSAGE;
const { PassThrough } = require('stream');

const { ProducerStream } = kafka;

if (semver.major(winston.version) === 2) {
  throw new Error('Winston version 2 is not supported. Please upgrade to version 3.');
}

const loggerDefaults = {
  stream: undefined
};

class KafkaTransport extends Transport {
  constructor(options) {
    super(options);

    this.options = Object.assign({}, loggerDefaults, options);

    this.client = kafka_client(this.options);

    // Check for options stream
    if (this.options.stream) {
      this.log_stream = new PassThrough();
      this.log_stream.pipe(this.options.stream);
    } else {
      this.log_stream = new ProducerStream({ kafka_client: this.client });
    }
  }

  log(level, msg, meta, callback) {
    console.log('In log level');
  }

  close(callback) {
    if (this.log_stream) {
      this.log_stream.end(callback);
    }
  }
}

winston.transports.Kafka = KafkaTransport;

module.exports = KafkaTransport;
