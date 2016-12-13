const args = process.argv.slice(2);
if (!args[0]) {
  console.log("Please supply a URL to test. Exiting...");
  process.exit();
}
const url = args[0];

// See https://www.npmjs.com/package/selenium-webdriver

var driver = require('selenium-webdriver');
var AxeBuilder = require('axe-webdriverjs');
var assert = require('assert');

var chrome = require('selenium-webdriver/chrome');
// As far as I can tell, the following is no longer required:
// var chromePath = require('chromedriver').path;
// var chromeService = new chrome.ServiceBuilder(chromePath).build();
// chrome.setDefaultService(chromeService);

var firefox = require('selenium-webdriver/firefox');
// As far as I can tell, the following is no longer required:
// var firefoxPath = require('geckodriver').path;
// var firefoxService = new firefox.ServiceBuilder(firefoxPath).build();
// firefox.setDefaultService(firefoxService);

describe('Accessibility', function() {
  var browser;
  this.timeout(10000);

  beforeEach(function(done) {
    browser = new driver.Builder()
      .forBrowser("chrome") // "firefox" or "chrome"
      // .setChromeOptions()
      // .setFirefoxOptions()
      .build();

    // browser.manage().timeouts("script", 10000);
    // browser.manage().timeouts("implicit", 10000);
    // browser.manage().timeouts("page load", 10000);

    // Requires server to be running (npm start)
    // browser.get('http://localhost:8080').then(function() {
    //   done();
    // });
    
    browser.get(url).then(function() {
      console.log("Got " + url);
      done();
    });
  });

  // Close website after each test is run (so it is opened fresh each time)
  afterEach(function(done) {
    browser.quit().then(function() {
      done();
    });
  });
  
  it('should analyze the page with aXe', function(done) {
    // this.timeout(10000);
    // setTimeout(done, 10000);
    AxeBuilder(browser)
      .analyze(function(results) {
        console.log("Hello");
        console.log('Accessibility Violations: ', results.violations.length);
        if (results.violations.length > 0) {
          console.log(results.violations);
        }
        assert.equal(results.violations.length, 0);
        done();
      });
    // done();
  });
  
  // it('should find violations', function(done) {
  //   AxeBuilder(browser)
  //     .withRules('html-has-lang')
  //     .analyze(function(results) {
  //       if (results.violations.length > 0) {
  //         console.log(results);
  //       }
  //       assert.equal(results.passes.length, 1);
  //       done();
  //     });
  // });

  // xit('should change state with the keyboard', function() {
  //   var selector = 'span[role="radio"][aria-labelledby="radiogroup-0-label-0"]';
  // 
  //   browser.findElement(driver.By.css(selector))
  //     .then(function (element) {
  //       element.sendKeys(Key.SPACE);
  //       return element;
  //     })
  //     .then(function (element) {
  //       return element.getAttribute('aria-checked')
  //     })
  //     .then(function (attr) {
  //       expect(attr).toEqual('true');
  //     });
  // });

});
