const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class FeedbackPage extends Page {
    timeout;
    confirmFeedbackButton = By.id('confirmFeedbackSelection');

    constructor(driver, userName){
        super(driver, userName)
    }

    async setFeedback(){
        await this.driver.wait(until.elementLocated(this.confirmFeedbackButton))
        console.log(`(${this.userName}) Feedback Selection button found. Clicking`);
        await this.driver.findElement(this.confirmFeedbackButton).click();
        
        return Date.now();
    }
}

module.exports = {
    FeedbackPage: FeedbackPage
}