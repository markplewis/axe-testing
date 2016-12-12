var selenium = require('selenium-webdriver');
var AxeBuilder = require('axe-webdriverjs');
var assert = require('assert');

// See https://www.npmjs.com/package/selenium-webdriver

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
    browser = new selenium.Builder()
      .forBrowser("firefox") // "firefox" or "chrome"
      // .setChromeOptions()
      // .setFirefoxOptions()
      .build();

    browser.get('http://localhost:8080')
      .then(function() {
        done();
      });
  });

  // Close website after each test is run (so it is opened fresh each time)
  afterEach(function(done) {
    browser.quit().then(function() {
      done();
    });
  });

  xit('should change state with the keyboard', function() {
    var selector = 'span[role="radio"][aria-labelledby="radiogroup-0-label-0"]';

    browser.findElement(selenium.By.css(selector))
      .then(function (element) {
        element.sendKeys(Key.SPACE);
        return element;
      })
      .then(function (element) {
        return element.getAttribute('aria-checked')
      })
      .then(function (attr) {
        expect(attr).toEqual('true');
      });
  });

  it('should analyze the page with aXe', function(done) {
    AxeBuilder(browser)
      .analyze(function(results) {
        console.log('Accessibility Violations: ', results.violations.length);
        if (results.violations.length > 0) {
          console.log(results.violations);
        }
        assert.equal(results.violations.length, 0);
        done();
      })
  });

  it('should find violations', function(done) {
    AxeBuilder(browser)
      .withRules('html-has-lang')
      .analyze(function(results) {
        if (results.violations.length > 0) {
          console.log(results);
        }
        assert.equal(results.passes.length, 1);
        done();
      });
  });

});
