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
        const contButton = this.driver.findElement(this.contButton);
        await contButton.click();
        await this.driver.wait(until.stalenessOf(contButton));

        return Date.now();
    }
}

module.exports = {
    InstructionsPage: InstructionsPage
}