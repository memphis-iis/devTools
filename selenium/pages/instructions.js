const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class InstructionsPage extends Page{
    timeout;
    contButton;

    constructor(driver, userName){
        super(driver, userName)
        this.contButton = By.id('continueButton')
    }

    async contInstructions(){
        await this.driver.wait(until.elementLocated(this.contButton));
        await this.driver.findElement(this.contButton).click();

        return Date.now();
    }

    async continueInformedConcent(){
        await this.driver.wait(until.elementLocated(this.contButton));
        console.log(`(${this.userName}) Continue button found. Clicking`);
        await this.driver.findElement(this.contButton).click();

        return Date.now();
    }
}

module.exports = {
    InstructionsPage: InstructionsPage
}