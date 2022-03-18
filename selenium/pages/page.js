class Page{
    driver; 
    userName;

    constructor(driver, userName){
        this.driver = driver;
        this.userName = userName;
    }
}

module.exports = {
    Page: Page
}