/*
This is a mock snippet of a NodeJS application that I made that sends data from file line-by-line to kinesis stream through AWS CLI Command-line interface
*/

var awsCli = require('aws-cli-js');
var Options = awsCli.Options;
var Aws = awsCli.Aws;

const aws = new Aws();
var count = 0;

var LineByLineReader = require('line-by-line'),
  lr= new LineByLineReader('/log');

lr.on('line', function (str) {
  try {
    aws.command('kinesis put-record --cli-binary-format raw-in-base64-out --stream-name RANDOM_NAME --partition-key 123 --data ' + "'" + str + "'");
    count++;
    if (count % 100 == 0) {
        lr.pause();
        console.log("# of Data sent: " + count);
        lr.resume();
      }
    } catch (err) {
      console.log(`err: ${err}\n`);
    }
});

lr.on('end', function () {
	console.log("Done Total: " + count);
});
