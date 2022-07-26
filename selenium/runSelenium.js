const { Builder } = require('selenium-webdriver');
const pgp = require('pg-promise')();
//const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
const localUrl = 'http://127.0.0.1:3000'//
const testUrl = 'https://staging.optimallearning.org';
// const server = 'http://iis-server.uom.memphis.edu:4444' //selenium grid server
const basicTest = require("./genericTrialsTest").basicTest;

let log = {};
let times = {};
let numCompletedTests = 0;
const totalTests = 1;
const numTrials = 10;
const connectionString = 'postgres://mofacts:test101@localhost:65432';
const db = pgp(connectionString);

async function runSelenium() {
    let userName = await generateRandomUser(5);
    log[userName] = "";
    times[userName] = [];
    let userId;

    let driver
    let coinflip = Math.floor(Math.random() * 2)
    // if(coinflip){
        console.log(`(${userName}) has been condemned to chrome`)
        driver = await new Builder()
        // .usingServer(server)
        .forBrowser('chrome')
        //.setChromeOptions(new chrome.Options().addArguments(['--headless','--no-sandbox', '--disable-dev-shm-usage']))
        .build();
    // }
    // else{
    //     console.log(`(${userName}) has been condemned to firefox`)
    //     driver = await new Builder()
    //     // .usingServer(server)
    //     .forBrowser('firefox')
    //     .setFirefoxOptions(new firefox.Options().headless())
    //     .build();
    // }
    driver.manage().setTimeouts({implicit: 0.5 })

    try{
        ret = await basicTest(driver, userName, localUrl, log, times, numTrials)
        log = ret['log']
        times = ret['times']
        userId = ret['userId']
    }
    catch(err){
        console.log(err)
    }
    finally{
        await driver.quit();
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

for(let i = 0; i < totalTests; i++){
    runSelenium().then(async (res) => {
        let userName = res.userName;
        let userId = res.userId;

        numCompletedTests += 1;
        console.log(userName + " logs: \n" + log[userName])
        console.log(`Time to complete trial: ${times[userName][times[userName].length - 1] - times[userName][0]}ms`)
        console.log(`Time to load TDF: ${times[userName][1] - times[userName][0]}ms`);
        console.log(`Completed ${numCompletedTests} / ${totalTests}\n`);
        const query = 'SELECT * FROM HISTORY WHERE userId=$1 ORDER BY eventid asc';
        const history = await db.manyOrNone(query, userId);
        for(his of history){
            console.log('eventId', his.eventid);
            console.log('itemid', his.itemid);
            console.log('recordedservertime', his.recordedservertime);
            console.log('totalservertime', parseInt(his.cf_feedback_latency) + parseInt(his.cf_start_latency) + parseInt(his.cf_end_latency));
            console.log('outcome', his.outcome);
            console.log('cf_response_time', his.cf_response_time);
            console.log('cf_start_latency', his.cf_start_latency);
            console.log('cf_end_latency', his.cf_end_latency);
            console.log('cf_feedback_latency', his.cf_feedback_latency);
            console.log('feedback_text', his.feedback_text);
            console.log('hintlevel', his.hintlevel);
            console.log()
        }
        console.log(history[0])
    });
}