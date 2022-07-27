const { Builder } = require('selenium-webdriver');
const pgp = require('pg-promise')();
//const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const localUrl = 'http://127.0.0.1:3000'//
const testUrl = 'https://staging.optimallearning.org';
const server = 'http://iis-server.uom.memphis.edu:4444' //selenium grid server

const testFile = process.argv[2];

const test = require(`./${testFile}`).test;

let log = {};
let times = {};
let numCompletedTests = 0;
const totalTests = 1;
const numTrials = 10;
const runLocal = true;
const useDistributedComputing = false;
const useCoinflip = false;
const useHeadless = false;

async function runSelenium() {
    let userName = await generateRandomUser(5);
    log[userName] = "";
    times[userName] = [];
    let userId;

    let driver = await createDriver(userName, server);
    driver.manage().setTimeouts({implicit: 0.5 })

    let url = testUrl;
    if(runLocal) url = localUrl;

    try{
        ret = await test(driver, userName, url, log, times, numTrials)
        log = ret['log']
        times = ret['times']
        userId = ret['userId']
    }
    catch(err){
        console.log(err)
    }
    finally{
        //await driver.quit();
        return {userName, userId};
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

async function createDriver(userName, server) {
    let coinflip = true;
    if(useCoinflip) coinflip = Math.floor(Math.random() * 2);

    if(coinflip){
        console.log(`(${userName}) has been condemned to chrome`)
        if(useDistributedComputing){
            return await new Builder()
            .usingServer(server)
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().addArguments(['--headless','--no-sandbox', '--disable-dev-shm-usage']))
            .build();
        }
        if(useHeadless){
            return await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().addArguments(['--headless','--no-sandbox', '--disable-dev-shm-usage']))
            .build();
        }
        return await new Builder()
        .forBrowser('chrome')
        .build();
    }
    else{
        console.log(`(${userName}) has been condemned to firefox`)
        if(useDistributedComputing){ 
            return await new Builder()
            .usingServer(server)
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options().headless())
            .build();
        }
        if(useHeadless){
            return await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(new firefox.Options().headless())
            .build();
        }
        return await new Builder()
        .forBrowser('firefox')
        .build();
    }
}

for(let i = 0; i < totalTests; i++){
    console.log(`Running test file ${testFile} ${totalTests} time(s)
    totalTests = ${totalTests}
    numTrials = ${numTrials}
    runLocal = ${runLocal}
    useDistributedComputing = ${useDistributedComputing}
    useCoinflip = ${useCoinflip}
    useHeadless = ${useHeadless}`);

    runSelenium().then(async (res) => {
        let userName = res.userName;
        let userId = res.userId;

        numCompletedTests += 1;
        console.log(userName + " logs: \n" + log[userName])
        console.log(`Time to complete trial: ${times[userName][times[userName].length - 1] - times[userName][0]}ms`)
        console.log(`Time to load TDF: ${times[userName][1] - times[userName][0]}ms`);
        console.log(`Completed ${numCompletedTests} / ${totalTests}\n`);
    });
}