const {Builder, Capabilities, By, Key, until} = require('selenium-webdriver');
const http = require('http')
const firefox = require('selenium-webdriver/firefox')
const chrome = require('selenium-webdriver/chrome')
const url = 'http://141.225.41.195:3000'//https://staging.optimallearning.org';
const server = 'http://iis-server.uom.memphis.edu:4444' //selenium grid server
let log = {};
let times = {};
let numCompletedTests = 0;
let curPage;
const totalTests = 1;


class SignUpPage {
    driver;
    timeout;
    userName;
    signInBox = By.id('signUpUsername');
    passwordBox = By.id('password1');
    password2Box = By.id('password2');
    signUpButton = By.id('signUpButton');

    constructor(driver, userName){
        this.userName = userName;
        this.driver = driver;
    }

    async logInUser(){
        console.log(`(${this.userName}) Signing up on ${url}`);
        await this.driver.findElement(this.signInBox).sendKeys(this.userName + '@loadtesting.org');
        await this.driver.findElement(this.passwordBox).sendKeys(this.userName + "123456");
        await this.driver.findElement(this.password2Box).sendKeys(this.userName + "123456");
        await this.driver.findElement(this.signUpButton).click();
    }
}

class InstructionsPage {
    driver;
    timeout;
    userName;
    contButton = By.id('continueButton');

    constructor(driver, userName){
        this.userName = userName;
        this.driver = driver;
    }

    async contInstructions(){
        await this.driver.wait(until.elementLocated(this.contButton));
        await this.driver.findElement(this.contButton).click();

        let curTime = Date.now();
        times[this.userName].push(curTime);
        log[this.userName] += `${curTime}: Left instructions page\n`
    }

    async continueInformedConcent(){
        await this.driver.wait(until.elementLocated(this.contButton));
        let curTime = Date.now();
        times[this.userName].push(curTime);
        log[this.userName] += `${curTime}: Informed concent rendered concent\n`

        console.log(`(${this.userName}) Continue button found. Clicking`);
        await this.driver.findElement(this.contButton).click();

        curTime = Date.now();
        times[this.userName].push(curTime);
        log[this.userName] += `${curTime}: Submitted Informed concent\n`
    }
}

class Profile {
    driver;
    timeout;
    userName;
    firstTdf = By.id('1');

    constructor(driver, userName){
        this.driver = driver;
        this.userName = userName
    }

    async launceTdf(){
        await this.driver.wait(until.elementLocated(this.firstTdf), 10000);
        console.log(`(${this.userName}) Loading TDF: ${await this.driver.findElement(this.firstTdf).getAttribute("name")}`);
        await this.driver.findElement(this.firstTdf).click();

        let curTime = Date.now();
        times[this.userName].push(curTime);
        log[this.userName] += `${curTime}: Launced TDF\n`
    }
}

class CardPage {
    driver;
    timeout;
    userName;
    userAnswer = By.id('userAnswer')

    constructor(driver, userName){
        this.driver = driver;
        this.userName = userName
    }

    async answerQuestion(index){
        await this.driver.wait(until.elementLocated(this.userAnswer));
        let curAnswer = await this.driver.executeScript("return Session.get('currentAnswer')")
        curAnswer = curAnswer.split('~')[0];
        console.log(`(${this.userName}) Answer Input found. Answering`);
        await this.driver.findElement(this.userAnswer).sendKeys(curAnswer, Key.ENTER);

        let curTime = Date.now();
        times[this.userName].push(curTime);
        log[this.userName] += `${curTime}: Answered question ${index}\n`

        await this.driver.wait(until.stalenessOf(this.driver.findElement(this.userAnswer)));
    }
}

class FeedbackPage {
    driver;
    timeout;
    userName;
    confirmFeedbackButton = By.id('confirmFeedbackSelection');

    constructor(driver, userName){
        this.driver = driver;
        this.userName = userName
    }

    async setFeedback(){
        await this.driver.wait(until.elementLocated(this.confirmFeedbackButton))
        console.log(`(${this.userName}) Feedback Selection button found. Clicking`);
        await this.driver.findElement(this.confirmFeedbackButton).click();
        
        let curTime = Date.now();
        times[this.userName].push(curTime);
        log[this.userName] += `${curTime}: Set Feedback\n`
    }
}

async function runSelenium() {
    let userName = await generateRandomUser(5);
    log[userName] = "";
    times[userName] = [];

    let driver
    let coinflip = 0 //Math.floor(Math.random() * 2)
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
        console.log(`Loading user ${userName} for ${url}`);
        await driver.get(url + "/signup");

        curPage = new SignUpPage(driver, userName);
        await curPage.logInUser(userName);
        
        curPage = new Profile(driver, userName);
        await curPage.launceTdf();

        curPage = new InstructionsPage(driver, userName);
        await curPage.continueInformedConcent();
    
        curPage = new CardPage(driver,userName);
        await curPage.answerQuestion(0);

        curPage = new InstructionsPage(driver, userName);
        await curPage.contInstructions();
    
        curPage = new FeedbackPage(driver, userName);
        await curPage.setFeedback();
    
        curPage = new CardPage(driver,userName);
        for(let i = 0; i < 1; i++)
            await curPage.answerQuestion(i + 1);

        numCompletedTests++;
        console.log(userName + " logs: \n" + log[userName])
        console.log(`Time to complete trial: ${times[userName][times[userName].length - 1] - times[userName][0]}ms`)
        console.log(`Time to load TDF: ${times[userName][1] - times[userName][0]}ms`);
        console.log(`Completed ${numCompletedTests} / ${totalTests}\n`)
    }
    catch(err){
        console.log(err)
    }
    finally{
        await driver.quit();
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
    runSelenium();
}