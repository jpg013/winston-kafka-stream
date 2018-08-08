const kafka       = require('kafka-node');

const KafkaClient = kafka.KafkaClient;

const default_config = {
  kafkaHost: '',
  autoConnect: true
};

let client;

function create_client(opts) {
  if (typeof client !== 'undefined') {
    return client;
  }

  const client_config = Object.assign({}, default_config, opts);

  client = new KafkaClient(client_config);

  client.on('error', err => {
    throw new Error(err);
  });

  client.once('connect', () => {
    client.loadMetadataForTopics([], function(error, results) {
      console.log(error, results);
    });

    const topics = [{
      topic: 'test'
    }];

    const options = {
      autoCommit: false,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      fromOffset: true
    };

    const consumer = new kafka.Consumer(client, topics, options);

    consumer.on('message', msg => {
      console.log('we have a freaking message!!', msg);
    });
  });

  return client;
}

module.exports = function get_client(opts) {
  if (typeof client !== 'undefined') {
    return client;
  }

  return create_client(opts)
};
