const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class SignUpPage extends Page {
    timeout;
    signInBox = By.id('signUpUsername');
    passwordBox = By.id('password1');
    password2Box = By.id('password2');
    signUpButton = By.id('signUpButton');

    constructor(driver, userName){
        super(driver, userName)
    }

    async logInUser(){
        await this.driver.findElement(this.signInBox).sendKeys(this.userName + '@loadtesting.org');
        await this.driver.findElement(this.passwordBox).sendKeys(this.userName + "123456");
        await this.driver.findElement(this.password2Box).sendKeys(this.userName + "123456");
        await this.driver.findElement(this.signUpButton).click();
    }
}

module.exports = {
    SignUpPage: SignUpPage
}