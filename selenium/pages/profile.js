const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class Profile extends Page {
    timeout;
    firstTdf = By.id('1');

    constructor(driver, userName){
        super(driver, userName)
    }

    async launceTdf(){
        await this.driver.wait(until.elementLocated(this.firstTdf), 10000);
        console.log(`(${this.userName}) Loading TDF: ${await this.driver.findElement(this.firstTdf).getAttribute("name")}`);
        await this.driver.findElement(this.firstTdf).click();

        return Date.now();
    }
}

module.exports = {
    Profile: Profile
}