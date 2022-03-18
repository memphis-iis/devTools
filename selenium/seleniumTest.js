const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');
let SignUpPage = require('./pages/signup').SignUpPage;
let InstructionsPage = require('./pages/instructions').InstructionsPage;
let FeedbackPage = require('./pages/feedback').FeedbackPage;
let CardPage = require('./pages/card').CardPage;
let Profile = require('./pages/profile').Profile;

const url = 'https://staging.optimallearning.org';
const server = 'http://iis-server.uom.memphis.edu:4444' //selenium grid server
let log = {};
let times = {};
let numCompletedTests = 0;
const totalTests = 1;
const numTrials = 0;

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

    //define all the pages used in the test
    let signUpPage = new SignUpPage(driver, userName);
    let profile = new Profile(driver, userName);
    let instructionsPage = new InstructionsPage(driver, userName);
    let cardPage = new CardPage(driver,userName);
    let feedbackPage = new FeedbackPage(driver, userName);

    try{
        console.log(`Loading user ${userName} for ${url}`);
        await driver.get(url + "/signup");

        console.log(`(${userName}) Signing up on ${url}`);
        await signUpPage.logInUser(userName);
        
        let curTime = await profile.launceTdf();
        times[userName].push(curTime);
        log[userName] += `${curTime}: Launced TDF\n`

        curTime = await instructionsPage.continueInformedConcent();
        times[userName].push(curTime);
        log[userName] += `${curTime}: Submitted Informed concent\n`
    
        curTime = await cardPage.answerQuestion();
        times[userName].push(curTime);
        log[userName] += `${curTime}: Answered question ${0}\n`

        curTime = await instructionsPage.contInstructions();
        times[userName].push(curTime);
        log[userName] += `${curTime}: Left instructions page\n`

        curTime = await feedbackPage.setFeedback();
        times[userName].push(curTime);
        log[userName] += `${curTime}: Set Feedback\n`
        
        for(let i = 0; i < numTrials; i++){
            curTime = await cardPage.answerQuestion(i + 1);
            times[userName].push(curTime);
            log[userName] += `${curTime}: Answered question ${i + 1}\n`
        }

        numCompletedTests++;
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