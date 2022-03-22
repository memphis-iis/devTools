const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class CardPage extends Page {
    timeout;
    userAnswer = By.id('userAnswer');
    mengButtonAnswer = By.name('level (-)')
    buttons = By.className('multipleChoiceButton');

    constructor(driver, userName){
        super(driver, userName)
        this.userAnswer = By.id('userAnswer');
    }

    async answerQuestionRandomOutcome(){
        let coinflip = Math.floor(Math.random() * 2)
        if(coinflip)
            return await this.answerQuestionWrong();
        else 
            return await this.answerQuestionCorrect();
    }

    async answerQuestionWrong(){
        await this.driver.wait(until.elementLocated(this.userAnswer));
        let curAnswer = await this.driver.executeScript("return Session.get('currentAnswer')")
        curAnswer = curAnswer.split('~')[0] + "This will make sure that no matter what the answer is wrong :)";
        console.log(`(${this.userName}) Answer Input found. Answering`);
        await this.driver.findElement(this.userAnswer).sendKeys(curAnswer, Key.ENTER);
        let curTime = Date.now();
        await this.driver.wait(until.stalenessOf(this.driver.findElement(this.userAnswer)));
        return curTime
    }

    async answerQuestionCorrect(){
        await this.driver.wait(until.elementLocated(this.userAnswer));
        let curAnswer = await this.driver.executeScript("return Session.get('currentAnswer')")
        curAnswer = curAnswer.split('~')[0];
        console.log(`(${this.userName}) Answer Input found. Answering`);
        await this.driver.findElement(this.userAnswer).sendKeys(curAnswer, Key.ENTER);
        let curTime = Date.now();
        await this.driver.wait(until.stalenessOf(this.driver.findElement(this.userAnswer)));
        return curTime
    }

    async answerMengButtonTrial(){
        await this.driver.wait(until.elementLocated(this.mengButtonAnswer));
        let curAnswer = (await this.driver.executeScript("return Session.get('currentAnswer')")).split('~')[0]
        console.log(`(${this.userName}) Answer Input found. Answering ${curAnswer}`);
        let elements = await this.driver.findElements(this.buttons)
        let element;
        if (curAnswer == 'level (-)'){
            element = elements[0]
        }
        else if(curAnswer == 'rising (/)'){
            element = elements[1]
        }
        else if(curAnswer == 'dipping (\\/)'){
            element = elements[2]
        }
        else if(curAnswer == 'falling (\\)'){
            element = elements[3]
        }

        await this.driver.wait(until.elementIsVisible(element));
        await this.driver.wait(until.elementIsEnabled(element));
        try{
            await element.sendKeys(Key.ENTER);
        }
        catch{
            return this.answerMengButtonTrial();
        }
        finally{
            let answerSubmit = Date.now();
            await this.driver.wait(until.stalenessOf(element));
            return answerSubmit
        }
    }
}

module.exports = {
    CardPage: CardPage
}