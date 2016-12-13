if (!process.env.URL) {
  console.log("Please supply a URL to test. Exiting...");
  process.exit();
}
const url = process.env.URL;

var webdriver = require('selenium-webdriver');
var By = webdriver.By;
var until = webdriver.until;

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

// Syntax notes: https://github.com/SeleniumHQ/selenium/issues/2969

describe('Accessibility', function() {
  // var driver;
  this.timeout(50000);
  /*
  beforeEach(function(done) {
    driver = new webdriver.Builder()
      .forBrowser("chrome") // "firefox" or "chrome"
      // .setChromeOptions()
      // .setFirefoxOptions()
      .build();
      
    driver.get(url).then(function() {
      console.log("Got " + url);
      done();
    });
  });

  // Close website after each test is run (so it is opened fresh each time)
  afterEach(function(done) {
    driver.quit().then(function() {
      done();
    });
  });
  */
  
  // THIS WORKS!
  // 
  // it('should Google stuff', function(done) {
  //   let driver = new webdriver.Builder().forBrowser('firefox').build();
  //   driver.get('http://www.google.com/ncr')
  //   .then(_ => driver.findElement(By.name('q')))
  //   .then(q => q.sendKeys('webdriver'))
  //   .then(_ => driver.findElement(By.name('btnG')))
  //   .then(btnG => btnG.click())
  //   .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000))
  //   .then(_ => {
  //     driver.quit();
  //     done();
  //   }, e => {
  //     console.error(e);
  //     driver.quit();
  //     done();
  //   });
  // });
  
  it('should analyze the page with aXe', function(done) {
    let driver = new webdriver.Builder().forBrowser('firefox').build();
    driver.get(url)
    .then(_ => {
      let webElement = driver.findElement(By.tagName('h1'));
      driver.wait(until.elementIsVisible(webElement), 10000);
    })
    // .then(_ => {
    //   return new Promise(function(resolve) {
    //     setTimeout(function(){
    //       console.log("Timeout finished");
    //       resolve();
    //     }, 2000);
    //   });
    // })
    .then(_ => {
      return new Promise(function(resolve, reject) {
        AxeBuilder(driver)
          .analyze(function(results) {
            console.log('Accessibility Violations: ', results.violations.length);
            // if (results.violations.length > 0) {
            //   console.log(results.violations);
            // }
            // try {
              assert.equal(results.violations.length, 0);
              resolve();
            // } catch(e) {
            //   console.log(e);
            //   reject();
            // }
          });
      });
    })
    .then(_ => {
      driver.quit();
      done();
    }, e => {
      // console.error(e);
      driver.quit();
      done();
    });
    // return new Promise(function(resolve) {
    //   AxeBuilder(driver)
    //     .analyze(function(results) {
    //       console.log('Accessibility Violations: ', results.violations.length);
    //       if (results.violations.length > 0) {
    //         console.log(results.violations);
    //       }
    //       assert.equal(results.violations.length, 0);
    //       resolve();
    //     });
    // });
    
    // AxeBuilder(driver)
    //   .analyze(function(results) {
    //     console.log('Accessibility Violations: ', results.violations.length);
    //     if (results.violations.length > 0) {
    //       console.log(results.violations);
    //     }
    //     assert.equal(results.violations.length, 0);
    //     done();
    //   });
  });
  
  it('should find violations', function(done) {
    let driver = new webdriver.Builder().forBrowser('firefox').build();
    driver.get(url)
    .then(_ => {
      return new Promise(function(resolve) {
        AxeBuilder(driver)
          .withRules('html-has-lang')
          .analyze(function(results) {
            // if (results.violations.length > 0) {
            //   console.log(results);
            // }
            try {
              assert.equal(results.passes.length, 1);
              resolve();
            } catch(e) {
              // console.log(e);
              reject();
            }
          });
      });
    })
    .then(_ => {
      driver.quit();
      done();
    }, e => {
      // console.error(e);
      driver.quit();
      done();
    });
  });
  
  /*
  it('should analyze the page with aXe', function(done) {
    this.timeout(10000);
    // return new Promise(function(resolve) {
    //   AxeBuilder(driver)
    //     .analyze(function(results) {
    //       console.log('Accessibility Violations: ', results.violations.length);
    //       if (results.violations.length > 0) {
    //         console.log(results.violations);
    //       }
    //       assert.equal(results.violations.length, 0);
    //       resolve();
    //     });
    // });
    AxeBuilder(driver)
      .analyze(function(results) {
        console.log('Accessibility Violations: ', results.violations.length);
        if (results.violations.length > 0) {
          console.log(results.violations);
        }
        assert.equal(results.violations.length, 0);
        done();
      });
  });
  */
  
  // xit('should change state with the keyboard', function() {
  //   var selector = 'span[role="radio"][aria-labelledby="radiogroup-0-label-0"]';
  // 
  //   driver.findElement(webdriver.By.css(selector))
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
