// See:
// - https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically
// - https://github.com/mochajs/mocha/blob/master/lib/runner.js#L40
// - http://stackoverflow.com/questions/29050720/run-mocha-programatically-and-pass-results-to-variable-or-function#answer-29802434

var Mocha = require('mocha');
var fs = require('fs');
var path = require('path');

var mocha = new Mocha({
  timeout: 10000
});
var testDir = './test';

// Add each .js file to the mocha instance
fs.readdirSync(testDir)
.filter(function(file) {
  // Only keep the .js files
  return file.substr(-3) === '.js';
})
.forEach(function(file) {
  mocha.addFile(path.join(testDir, file));
});

// Run the tests
mocha.run(function(failures) {
  process.on('exit', function() {
    // exit with non-zero status if there were failures
    process.exit(failures);
  });
})
.on('test', function(test) {
  console.log('Test started: '+ test.title);
})
.on('test end', function(test) {
  console.log('Test done: '+ test.title);
})
.on('pass', function(test) {
  console.log('Test passed');
  console.log(test);
})
.on('fail', function(test, err) {
  console.log('Test fail');
  console.log(test);
  console.log(err);
})
.on('end', function() {
  console.log('All done');
});
