if (!process.env.URL) {
  console.log("Please supply a URL to test. Exiting...");
  process.exit();
}
const url = process.env.URL;
const browser = "chrome"; // "chrome" or "firefox"

// See https://seleniumhq.github.io/selenium/docs/api/javascript/index.html
// See https://www.npmjs.com/package/selenium-webdriver
// See https://github.com/SeleniumHQ/selenium/issues/2969

const {chrome, firefox, Builder, By, promise, until} = require('selenium-webdriver');
const AxeBuilder = require('axe-webdriverjs');
const assert = require('assert');

describe('Accessibility', function() {
  // let driver;
  this.timeout(50000);
  
  // beforeEach(function(done) {
  //   driver = new Builder()
  //   .forBrowser(browser)
  //   // .setChromeOptions()
  //   // .setFirefoxOptions()
  //   .build();
  // });

  // afterEach(function(done) {
  //   driver.quit().then(function() {
  //     done();
  //   });
  // });
  
  /**
   * Standard method (WORKS!)
   */
  // it('should perform a Google search', function(done) {    
  //   let driver = new Builder().forBrowser(browser).build();
  //   driver.get('http://www.google.com/ncr')
  //   .then(function() {
  //     return driver.wait(until.elementIsVisible(
  //       driver.findElement({name: 'q'})
  //     ), 10000);
  //   })
  //   .then(function() {
  //     return driver.findElement({name: 'q'});
  //   })
  //   .then(function(q) {
  //     return q.sendKeys('webdriver');
  //   })
  //   .then(function() {
  //     return driver.wait(until.elementIsVisible(
  //       driver.findElement({name: 'btnG'})
  //     ), 10000);
  //   })
  //   .then(function() {
  //     return driver.findElement({name: 'btnG'});
  //   })
  //   .then(function(btnG) {
  //     return btnG.click();
  //   })
  //   .then(function() {
  //     return driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  //   })
  //   .then(
  //     function() {
  //       console.log('Normal SUCCESS!');
  //       driver.quit();
  //       done();
  //     },
  //     function(e) {
  //       console.error('Normal FAILURE: ' + e);
  //       driver.quit();
  //       done();
  //     }
  //   );
  // });
  
  /**
   * Generator method (WORKS!)
   */
  // it('should perform a Google search', function(done) {
  //   let result = promise.consume(
  //     function* doGoogleSearch() {
  //       let driver = new Builder().forBrowser(browser).build();
  //       yield driver.get('http://www.google.com/ncr');
  //       yield driver.wait(until.elementIsVisible(driver.findElement({name: 'q'})), 10000);
  //       yield driver.findElement(By.name('q')).sendKeys('webdriver');
  //       yield driver.wait(until.elementIsVisible(driver.findElement({name: 'btnG'})), 10000);
  //       yield driver.findElement(By.name('btnG')).click();
  //       yield driver.wait(until.titleIs('webdriver - Google Search'), 1000);
  //       yield driver.quit();
  //     }
  //   );
  //   result.then(
  //     function() {
  //       console.log('Generator SUCCESS!');
  //       driver.quit();
  //       done();
  //     },
  //     function(e) {
  //       console.error('Generator FAILURE: ' + e);
  //       driver.quit();
  //       done();
  //     }
  //   );
  // });
  
  // it('should analyze the page with aXe', function(done) {
  //   let result = promise.consume(
  //     function* doGoogleSearch() {
  //       let driver = new Builder().forBrowser(browser).build();
  //       yield driver.get(url);
  //       yield driver.wait(until.elementIsVisible(driver.findElement(By.tagName('h1')), 10000));
  //       yield new Promise(function(resolve, reject) {
  //         console.log("Hello");
  //         AxeBuilder(driver).analyze(function(results) {
  //           console.log('Accessibility Violations: ', results.violations.length);
  //           // if (results.violations.length > 0) {
  //           //   console.log(results.violations);
  //           // }
  //           // try {
  //             assert.equal(results.violations.length, 0);
  //             resolve();
  //           // } catch(e) {
  //           //   console.log(e);
  //           //   reject();
  //           // }
  //         });
  //       });
  //       yield driver.quit();
  //     }
  //   );
  //   result.then(
  //     function() {
  //       console.log('Generator SUCCESS!');
  //       driver.quit();
  //       done();
  //     },
  //     function(e) {
  //       console.error('Generator FAILURE: ' + e);
  //       driver.quit();
  //       done();
  //     }
  //   );
  // });
  
  it('should analyze the page with aXe', function(done) {
    let driver = new Builder().forBrowser(browser).build();
    driver.get(url)
    .then(function() {
      return driver.wait(until.elementIsVisible(
        driver.findElement(By.tagName('h1'))
      ), 10000);
    })
    .then(function() {
      return new Promise(function(resolve, reject) {
        console.log("Hello");
        AxeBuilder(driver).analyze(function(results) {
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
    .then(
      function() {
        console.log('SUCCESS!');
        driver.quit();
        done();
      },
      function(e) {
        console.error('FAILURE: ' + e);
        driver.quit();
        done();
      }
    );
  });
  
  // THIS WORKS!
  // 
  // it('should Google stuff', function(done) {
  //   let driver = new Builder().forBrowser('firefox').build();
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
  
  // THIS (MOSTLY) WORKS!
  //
  // it('should analyze the page with aXe', function(done) {
  //   let driver = new Builder().forBrowser('firefox').build();
  //   driver.get(url)
  //   .then(_ => {
  //     let webElement = driver.findElement(By.tagName('h1'));
  //     driver.wait(until.elementIsVisible(webElement), 10000);
  //   })
  //   // .then(_ => {
  //   //   return new Promise(function(resolve) {
  //   //     setTimeout(function(){
  //   //       console.log("Timeout finished");
  //   //       resolve();
  //   //     }, 2000);
  //   //   });
  //   // })
  //   .then(_ => {
  //     return new Promise(function(resolve, reject) {
  //       AxeBuilder(driver)
  //         .analyze(function(results) {
  //           console.log('Accessibility Violations: ', results.violations.length);
  //           // if (results.violations.length > 0) {
  //           //   console.log(results.violations);
  //           // }
  //           // try {
  //             assert.equal(results.violations.length, 0);
  //             resolve();
  //           // } catch(e) {
  //           //   console.log(e);
  //           //   reject();
  //           // }
  //         });
  //     });
  //   })
  //   .then(_ => {
  //     driver.quit();
  //     done();
  //   }, e => {
  //     // console.error(e);
  //     driver.quit();
  //     done();
  //   });
  //   // return new Promise(function(resolve) {
  //   //   AxeBuilder(driver)
  //   //     .analyze(function(results) {
  //   //       console.log('Accessibility Violations: ', results.violations.length);
  //   //       if (results.violations.length > 0) {
  //   //         console.log(results.violations);
  //   //       }
  //   //       assert.equal(results.violations.length, 0);
  //   //       resolve();
  //   //     });
  //   // });
  //   
  //   // AxeBuilder(driver)
  //   //   .analyze(function(results) {
  //   //     console.log('Accessibility Violations: ', results.violations.length);
  //   //     if (results.violations.length > 0) {
  //   //       console.log(results.violations);
  //   //     }
  //   //     assert.equal(results.violations.length, 0);
  //   //     done();
  //   //   });
  // });
  
  // THIS (MOSTLY) WORKS!
  //
  // it('should find violations', function(done) {
  //   let driver = new Builder().forBrowser('firefox').build();
  //   driver.get(url)
  //   .then(_ => {
  //     return new Promise(function(resolve) {
  //       AxeBuilder(driver)
  //         .withRules('html-has-lang')
  //         .analyze(function(results) {
  //           // if (results.violations.length > 0) {
  //           //   console.log(results);
  //           // }
  //           try {
  //             assert.equal(results.passes.length, 1);
  //             resolve();
  //           } catch(e) {
  //             // console.log(e);
  //             reject();
  //           }
  //         });
  //     });
  //   })
  //   .then(_ => {
  //     driver.quit();
  //     done();
  //   }, e => {
  //     // console.error(e);
  //     driver.quit();
  //     done();
  //   });
  // });
  
  // OLD
  
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
