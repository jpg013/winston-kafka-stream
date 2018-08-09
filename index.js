const winston     = require('winston');
const semver      = require('semver');
const KafkaStream = require('./winston-kafka-stream');

if (semver.major(winston.version) === 2) {
  throw new Error('Winston version 2 is not supported. Please upgrade to version 3.');
}

winston.transports.KafkaStream = KafkaStream;

module.exports = KafkaStream;
