if (!process.env.URL) {
  console.log("Please supply a URL to test. Exiting...");
  process.exit();
}
const url = process.env.URL;
const browser = "firefox"; // "firefox" or "chrome" (which has problems)

const { Builder, By, chrome, firefox } = require('selenium-webdriver');
const AxeBuilder = require('axe-webdriverjs');
const assert = require('assert');

describe('Accessibility', function() {
  let driver;
  this.timeout(10000);

  beforeEach(function(done) {
    driver = new Builder()
      .forBrowser(browser)
      // .setChromeOptions()
      // .setFirefoxOptions()
      .build();

    driver.get(url).then(function() {
      done();
    });
  });

  afterEach(function(done) {
    driver.quit().then(function() {
      done();
    });
  });

  it('should analyze the page with aXe', function(done) {
    AxeBuilder(driver)
      .analyze(function(results) {
        console.log(`Accessibility Violations: ${results.violations.length}`);
        if (results.violations.length > 0) {
          results.violations.forEach((violation, index) => {
            console.log(`${index + 1}. ${violation.help}`);
          });
        }
        assert.equal(results.violations.length, 0);
        done();
      })
  });

  it('should find violations', function(done) {
    AxeBuilder(driver)
      .withRules('html-has-lang')
      .analyze(function(results) {
        if (results.violations.length > 0) {
          results.violations.forEach((violation, index) => {
            console.log(`${index + 1}. ${violation.help}`);
          });
        }
        assert.equal(results.passes.length, 1);
        done();
      });
  });
  
  // xit('should change state with the keyboard', function() {
  //   var selector = 'span[role="radio"][aria-labelledby="radiogroup-0-label-0"]';
  // 
  //   driver.findElement(By.css(selector))
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
