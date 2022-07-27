const { SignUpPage } = require('./pages/signup');
const { SignInPage } = require('./pages/signIn');
const { Profile } = require('./pages/profile');
const { UserAdmin } = require('./pages/userAdmin');
const { MongoDBHelper } = require('./helpers/mongoDBHelper');

//admin should be able to log in, create teachers from users, and do admin things
async function test(driver, userName, url, log, times) {
    const mongodb = new MongoDBHelper();

    console.log(`using ${userName} as a test user for admin privledges`);
    adminName = 'rhodesawhite@gmail.com';

    //define all the pages used in the test
    const adminSignInPage = new SignInPage(driver, adminName);
    const userSignInPage = new SignInPage(driver, userName);
    const profile = new Profile(driver, adminName);
    const userAdmin = new UserAdmin(driver, adminName);

    console.log(`Loading ${url}`);
    await driver.get(url);

    console.log(`Creating test user account for ${userName}`);
    const userId = await userSignInPage.logInUser();
    console.log(`userId: ${userId}`);

    await userSignInPage.logOutUser();

    console.log(`(${adminName}) Signing in on ${url}`);
    await adminSignInPage.logInUser();
    
    let curTime = await profile.launchUserAdminPage();
    times[userName].push(curTime);
    log[userName] += `${curTime}: opened user admin page\n`

    curTime = await userAdmin.findUser(userName);
    times[userName].push(curTime);
    log[userName] += `${curTime}: found user ${userName} in user admin page\n`

    curTime = await userAdmin.toggleUserAdminStatus();
    times[userName].push(curTime);
    log[userName] += `${curTime}: added user ${userName} to admin group\n`

    let userData = await mongodb.queryDBOne('users', {username: userName.toUpperCase()});
    console.log(`${userName} is in admin role? `, userData.roles[0] == 'admin')

    curTime = await userAdmin.toggleUserAdminStatus();
    times[userName].push(curTime);
    log[userName] += `${curTime}: removed user ${userName} from admin group\n`

    userData = await mongodb.queryDBOne('users', {username: userName.toUpperCase()});
    console.log(`${userName} is in admin role? `, userData.roles[0] == 'admin')

    curTime = await userAdmin.toggleUserTeacherStatus();
    times[userName].push(curTime);
    log[userName] += `${curTime}: added user ${userName} to teacher group\n`

    userData = await mongodb.queryDBOne('users', {username: userName.toUpperCase()});
    console.log(`${userName} is in teacher role? `, userData.roles[0] == 'teacher')

    curTime = await userAdmin.toggleUserTeacherStatus();
    times[userName].push(curTime);
    log[userName] += `${curTime}: removed user ${userName} from teacher group\n`

    userData = await mongodb.queryDBOne('users', {username: userName.toUpperCase()});
    console.log(`${userName} is in teacher role? `, userData.roles[0] == 'teacher')

    return {times, log, userId}
};

module.exports = {
    test
}