const { ProducerStream } = require('kafka-node');
const Transport          = require('winston-transport');
const noop               = require('./lib/noop');
const { PassThrough }    = require('stream');
const MESSAGE            = require('triple-beam').MESSAGE;

const DEFAULTS = {
  stream: undefined,
  kafkaHost: '127.0.0.1:9092',
  producer: {
    topic: '',
    partition: 0
  }
};

class KafkaTransport extends Transport {
  constructor(options) {
    super(options);

    this.options = Object.assign({}, DEFAULTS, options);

    this.is_log_stream_ready = true;

    // Check for options stream
    if (this.options.stream) {
      this.log_stream = new PassThrough();
      this.log_stream.pipe(this.options.stream);
    } else {
      this.log_stream = new ProducerStream({
        kafkaClient: {
          kafkaHost: this.options.kafkaHost
        },
        ...this.options.producer
      });
    }

    this.is_log_stream_ready = true;

    this.log_stream.on('error', () => {
      this.is_log_stream_ready = false;
    });
  }

  _sendPayload(payload, callback) {
    callback = callback || noop;

    try {
      if (!payload) {
        throw new Error('Missing required payload.');
      }

      if (!this.is_log_stream_ready) {
        throw new Error('Log stream is not available.');
      }

      this.log_stream.write(payload);

      callback(undefined);
    } catch(error) {
      callback(error);
    }
  }

  log(info, callback) {
    callback = (typeof callback === 'function') ? callback : noop;


    try {
      const { message } = JSON.parse(info[MESSAGE]);

      const payload = {
        topic: this.options.producer.topic,
        messages: [ message ],
      };

      this._sendPayload(payload, error => {
        if (error) {
          return callback(error);
        }

        this.emit('logged', payload);
        callback(null, true);
      });
    } catch(error) {
      callback(error);
    }
  }

  close(callback) {
    if (this.log_stream) {
      this.log_stream.end(callback);
    }
  }
}

module.exports = KafkaTransport;
