const { By , Key, until } = require("selenium-webdriver");

class Page{
    driver; 
    userName;
    logOutButton = By.id('logoutButton');

    constructor(driver, userName){
        this.driver = driver;
        this.userName = userName;
    }

    async logOutUser(){
        await this.driver.wait(until.elementLocated(this.logOutButton), 10000);
        await this.driver.findElement(this.logOutButton).click();
    }
}

module.exports = {
    Page: Page
}