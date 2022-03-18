const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class CardPage extends Page {
    timeout;
    userAnswer;

    constructor(driver, userName){
        super(driver, userName)
        this.userAnswer = By.id('userAnswer');
    }

    async answerQuestion(){
        await this.driver.wait(until.elementLocated(this.userAnswer));
        let curAnswer = await this.driver.executeScript("return Session.get('currentAnswer')")
        curAnswer = curAnswer.split('~')[0];
        console.log(`(${this.userName}) Answer Input found. Answering`);
        await this.driver.findElement(this.userAnswer).sendKeys(curAnswer, Key.ENTER);
        let curTime = Date.now();
        await this.driver.wait(until.stalenessOf(this.driver.findElement(this.userAnswer)));
        return curTime
    }
}

module.exports = {
    CardPage: CardPage
}