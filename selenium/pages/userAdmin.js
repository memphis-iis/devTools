const { By, Key, until } = require('selenium-webdriver');
let Page = require('./page').Page;

class UserAdmin extends Page {
    uploadUsersBrowse = By.id('upload-users');
    uploadUsersSubmit = By.id('doUploadUsers');
    resetTeacherSecret = By.id('resetAllSecretKeys');
    userListFilterBox = By.id('filter');
    toggleAdminStatusButton = By.css("button[data-rolename='admin']");
    toggleTeacherStatusBotton = By.css("button[data-rolename='teacher']");
    userAdminModal = By.id('userAdminModal');
    impersonateButton;

    constructor(driver, userName){
        super(driver, userName)
    }

    async findUser(newUserName){
        await this.driver.wait(until.elementLocated(this.userListFilterBox), 10000);
        await this.driver.findElement(this.userListFilterBox).clear();
        await this.driver.findElement(this.userListFilterBox).sendKeys(newUserName.toUpperCase(), Key.ENTER);

        return Date.now();
    }

    async toggleUserAdminStatus(){
        console.log('toggling admin status for user')
        await this.driver.wait(until.elementLocated(this.toggleAdminStatusButton), 10000);
        await this.driver.findElement(this.toggleAdminStatusButton).click();
        
        const timestamp = Date.now();

        await this.driver.wait(until.alertIsPresent());
        await this.driver.switchTo().alert().accept();

        await this.driver.wait(until.elementLocated(this.userAdminModal, 10000));
        await this.driver.wait(until.elementIsNotVisible(this.driver.findElement(this.userAdminModal)));

        return timestamp;
    }

    async toggleUserTeacherStatus(){
        console.log('toggling teacher status for user')
        await this.driver.wait(until.elementLocated(this.toggleTeacherStatusBotton), 10000);
        await this.driver.findElement(this.toggleTeacherStatusBotton).click();
        
        const timestamp = Date.now();

        await this.driver.wait(until.alertIsPresent());
        await this.driver.switchTo().alert().accept();

        await this.driver.wait(until.elementLocated(this.userAdminModal, 10000));
        await this.driver.wait(until.elementIsNotVisible(this.driver.findElement(this.userAdminModal)));

        return timestamp;
    }
}

module.exports = {
    UserAdmin: UserAdmin
}