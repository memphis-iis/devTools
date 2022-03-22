const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const url = 'http://141.225.41.195:3000'//'https://staging.optimallearning.org';
const server = 'http://iis-server.uom.memphis.edu:4444' //selenium grid server
const basicTest = require("./genericTrialsTest").basicTest;

let log = {};
let times = {};
let numCompletedTests = 0;
const totalTests = 15;

async function runSelenium() {
    let userName = await generateRandomUser(5);
    log[userName] = "";
    times[userName] = [];

    let driver
    let coinflip = Math.floor(Math.random() * 2)
    if(coinflip){
        console.log(`(${userName}) has been condemned to chrome`)
        driver = await new Builder()
        .usingServer(server)
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments(['--headless','--no-sandbox', '--disable-dev-shm-usage']))
        .build();
    }
    else{
        console.log(`(${userName}) has been condemned to firefox`)
        driver = await new Builder()
        .usingServer(server)
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options().headless())
        .build();
    }
    driver.manage().setTimeouts({implicit: 0.5 })

    try{
        ret = await basicTest(driver, userName, url, log, times)
        log = ret['log']
        times = ret['times']
    }
    catch(err){
        console.log(err)
    }
    finally{
        await driver.quit();
        return userName;
    }
};

async function generateRandomUser(length) {
    //Makes a random string
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

for(let i = 0; i < totalTests; i++){
    runSelenium().then((userName) => {
        console.log(userName + " logs: \n" + log[userName])
        console.log(`Time to complete trial: ${times[userName][times[userName].length - 1] - times[userName][0]}ms`)
        console.log(`Time to load TDF: ${times[userName][1] - times[userName][0]}ms`);
        console.log(`Completed ${numCompletedTests} / ${totalTests}\n`)
    });
}