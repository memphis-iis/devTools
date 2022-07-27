const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class Profile extends Page {
    timeout;
    firstTdf = By.id('1');
    mengTdf = By.name('Chineseoptimfemaletest1');
    userAdminButton = By.id('userAdminButton');

    constructor(driver, userName){
        super(driver, userName)
    }

    async launchFirstTdfTdf(){
        await this.driver.wait(until.elementLocated(this.firstTdf), 10000);
        console.log(`(${this.userName}) Loading TDF: ${await this.driver.findElement(this.firstTdf).getAttribute("name")}`);
        await this.driver.findElement(this.firstTdf).click();

        return Date.now();
    }

    async launchTdfById(id){
        await this.driver.wait(until.elementLocated(By.id(id)), 10000);
        console.log(`(${this.userName}) Loading TDF: ${await this.driver.findElement(By.id(id)).getAttribute("name")}`);
        await this.driver.findElement(By.id(id)).click();

        return Date.now();
    }

    async launchMengTdf(){
        await this.driver.wait(until.elementLocated(this.mengTdf), 10000);
        console.log(`(${this.userName}) Loading TDF: ${await this.driver.findElement(this.mengTdf).getAttribute("name")}`);
        await this.driver.findElement(this.mengTdf).click();

        return Date.now();
    }

    async launchUserAdminPage(){
        await this.driver.wait(until.elementLocated(this.userAdminButton), 10000);
        console.log(`(${this.userName}) Loading user admin page`);
        await this.driver.findElement(this.userAdminButton).click();

        return Date.now();
    }
}

module.exports = {
    Profile: Profile
}