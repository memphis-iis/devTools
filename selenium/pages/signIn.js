const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class SignInPage extends Page {
    timeout;
    signInBox = By.id('testUsername');
    signInButton = By.id('testSignInButton');

    constructor(driver, userName){
        super(driver, userName)
    }

    async logInUser(){
        await this.driver.wait(until.elementLocated(this.signInBox), 10000);
        await this.driver.findElement(this.signInBox).sendKeys(this.userName);
        await this.driver.findElement(this.signInButton).click();
    
        return await this.driver.executeScript("return Meteor.userId()");
    }
}

module.exports = {
    SignInPage: SignInPage
}