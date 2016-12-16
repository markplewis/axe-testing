if (!process.env.URL) {
  console.log("Please supply a URL to test. Exiting...");
  process.exit();
}
const url = process.env.URL;
const browser = "firefox"; // "firefox" or "chrome" (which has problems)

const { Builder, By, chrome, firefox, until, promise } = require('selenium-webdriver');
const AxeBuilder = require('axe-webdriverjs');
const assert = require('assert');
const colors = require("colors");

const fs = require("fs-extra");
const path = require("path");

function createFile(id, data) {
  const filePath = path.resolve(`./logs/${id}.txt`);
  try {
    fs.outputFileSync(path.resolve(filePath), data);
  } catch(e) {
    console.error(e);
    return false;
  }
  return true;
}

function appendToFile(id, data) {
  const filePath = path.resolve(`./logs/${id}.txt`);
  try {
    fs.ensureFileSync(filePath);
    fs.appendFileSync(filePath, data);
  } catch(e) {
    console.error(e);
    return false;
  }
  return true;
}

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
      driver.wait(until.elementIsVisible(
        driver.findElement(By.tagName("h1"))
      ), 10000)
      .then(function() {
        // console.log("h1 is visible");
        done();
      });
    });
  });

  afterEach(function(done) {
    driver.quit().then(function() {
      done();
    });
  });
  
  // it('should have a title', function(done) {
  //   driver.wait(driver.findElement(By.css("title")).then(
  //     function(webElement) {
  //       console.log("title exists");
  //       webElement.getText().then(function(text) {
  //         console.log(text);
  //       });
  //     },
  //     function(err) {
  //       throw new Error("title does not exist");
  //     }
  //   ), 10000)
  //   .then(function() {
  //     done();
  //   });
  // });
  
  // it('should analyze the page with aXe', function(done) {
  //   driver.wait(driver.findElement(By.css("title")).then(
  //     function(webElement) {
  //       console.log("title exists");
  //     },
  //     function(err) {
  //       throw new Error("title does not exist");
  //     }
  //   ), 10000)
  //   .then(function() {
  //     AxeBuilder(driver).analyze(function(results) {
  //       console.log(`Accessibility Violations: ${results.violations.length}`);
  //       if (results.violations.length > 0) {
  //         results.violations.forEach((violation, index) => {
  //           console.log(`${index + 1}. ${violation.help}`);
  //         });
  //       }
  //       assert.equal(results.violations.length, 0);
  //       done();
  //     });
  //   });
  // });
  
  it('should find violations', function(done) {
    // driver.wait(driver.findElement(By.css("title")).then(
    //   function(webElement) {
    //     console.log("title exists");
    //   },
    //   function(err) {
    //     throw new Error("title does not exist");
    //   }
    // ), 10000)
    // .then(function() {
      console.log("Analyzing page...");
      const axe = AxeBuilder(driver);
      // See https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md
      // axe.withRules(["html-has-lang", "html-lang-valid", "button-name", "bypass"]);
      axe.analyze(function(results) {
        const failLogId = results.timestamp + "-fail";
        const passLogId = results.timestamp + "-pass";
        
        if (results.violations.length > 0) {
          const failLogCreated = createFile(failLogId,
            "Accessibility violation log\n\n" +
            "Date: " + results.timestamp + "\n" +
            "URL: " + results.url + "\n\n"
          );
          results.violations.forEach(violation => {
            console.log("FAILED".red + " " + violation.help);
            if (failLogCreated) {
              appendToFile(failLogId,
                "FAILED [" + violation.impact + "]:\n" +
                "  Description: " + violation.description + "\n" +
                "  Help: " + violation.help + "\n" +
                "  More info: " + violation.helpUrl + "\n" +
                "  Tags: " + violation.tags.join(", ") + "\n" +
                "  HTML affected:\n\n"
              );
              violation.nodes.forEach(node => {
                appendToFile(failLogId, `    ${node.html}\n\n`);
              });
              appendToFile(failLogId, "\n");
            }
          });
        }
        if (results.passes.length > 0) {
          const passLogCreated = createFile(passLogId,
            "Accessibility compliance log\n\n" +
            "Date: " + results.timestamp + "\n" +
            "URL: " + results.url + "\n\n"
          );
          results.passes.forEach(pass => {
            console.log("PASSED".green + " " + pass.help);
            if (passLogCreated) {
              appendToFile(passLogId,
                "PASSED:\n" +
                "  Description: " + pass.description + "\n" +
                "  Help: " + pass.help + "\n" +
                "  More info: " + pass.helpUrl + "\n" +
                "  Tags: " + pass.tags.join(", ") + "\n"
                // "  HTML affected:\n\n"
              );
              // pass.nodes.forEach(node => {
              //   appendToFile(passLogId, `    ${node.html}\n\n`);
              // });
              appendToFile(passLogId, "\n");
            }
          });
        }
        assert.equal(results.passes.length, results.passes.length + results.violations.length);
        done();
      });
    // });
  });
    
  // it('should say hello', function(done) {
  //   console.log("Hello");
  //   done();
  // });
  
});





// driver.get(url).then(function() {
//   done();
// });

// driver.get(url).then(function() {
//   return driver.wait(function() {
//     return driver.findElements(By.tagName("h1"));
//   }, 10000)
//   .then(function() {
//     console.log("h1 present");
//     done();
//   });
// });

// driver.get(url).then(function() {
//   AxeBuilder(driver)
//     .analyze(function(results) {
//       console.log(`Accessibility Violations: ${results.violations.length}`);
//       if (results.violations.length > 0) {
//         results.violations.forEach((violation, index) => {
//           console.log(`${index + 1}. ${violation.help}`);
//         });
//       }
//       assert.equal(results.violations.length, 0);
//       done();
//     })
// });

// it('title should exist', function(done) {
//   // driver.wait(function() {
//   //   driver.findElements(By.css("title")).then(function() {
//   //     console.log("title exists");
//   //     done();
//   //   });
//   // }, 10000);
//   
//   // driver.findElements(By.css("title")).then(
//   //   function(webElements) {
//   //     if (webElements.length) {
//   //       webElements[0].getText().then(function(text) {
//   //         console.log("Title found: " + text);
//   //         assert(text);
//   //         done();
//   //       });
//   //     } else {
//   //       assert.fail(1, 1, "Title not found");
//   //       done();
//   //     }
//   //   },
//   //   function(err) {
//   //     assert.fail(1, 1, "Title not found");
//   //     done();
//   //   }
//   // );
// });
  
  // it('title should exist', function(done) {
  //   driver.wait(driver.findElement(By.css("title")), 10000).then(
  //     function(webElement) {
  //       console.log("title exists");
  //       webElement.getText().then(function(text) {
  //         console.log("title = " + text);
  //         done();
  //       });
  //     },
  //     function(err) {
  //       if (err.state && err.state === "no such element") {
  //         console.log("title does not exist");
  //         done();
  //       } else {
  //         // promise.rejected(err);
  //         done();
  //       }
  //     }
  //   );
  // });
    
    // AxeBuilder(driver)
    //   .analyze(function(results) {
    //     console.log(`Accessibility Violations: ${results.violations.length}`);
    //     if (results.violations.length > 0) {
    //       results.violations.forEach((violation, index) => {
    //         console.log(`${index + 1}. ${violation.help}`);
    //       });
    //     }
    //     assert.equal(results.violations.length, 0);
    //     done();
    //   });
  
  
  
  
  
  
  // it('should find violations', function(done) {
  //   AxeBuilder(driver)
  //     .withRules('html-has-lang')
  //     .analyze(function(results) {
  //       if (results.violations.length > 0) {
  //         results.violations.forEach((violation, index) => {
  //           console.log(`${index + 1}. ${violation.help}`);
  //         });
  //       }
  //       assert.equal(results.passes.length, 1);
  //       done();
  //     });
  // });
  
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

  // function isItThere(driver, element) {
  //   driver.findElement(By.id(element)).then(
  //     function(webElement) {
  //       console.log(element + ' exists');
  //     },
  //     function(err) {
  //       if (err.state && err.state === 'no such element') {
  //         console.log(element + ' not found');
  //       } else {
  //         promise.rejected(err);
  //       }
  //     }
  //   );
  // }