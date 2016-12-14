## Test remote pages

1. Install the dependencies: `npm install`
2. If, for some reason, you don't have a copy of the Selenium Standalone Server `.jar` in your project folder, download it from: http://www.seleniumhq.org/download/
4. Test a page via: `URL=http://www.example.com npm test`

## Test local pages

1. Install the dependencies: `npm install`
2. If, for some reason, you don't have a copy of the Selenium Standalone Server `.jar` in your project folder, download it from: http://www.seleniumhq.org/download/
3. Edit `server.js`, point it to your local page via the `root` parameter and tell it which port to listen to via the `listen()` function
4. Start the server: `node server.js`
5. With the server still running, open a separate terminal tab and test your page via: `URL=http://localhost:8080 npm test`, where `8080` is the port that you specified in `server.js`