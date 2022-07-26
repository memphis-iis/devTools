let SignUpPage = require('./pages/signup').SignUpPage;
let InstructionsPage = require('./pages/instructions').InstructionsPage;
let FeedbackPage = require('./pages/feedback').FeedbackPage;
let CardPage = require('./pages/card').CardPage;
let Profile = require('./pages/profile').Profile;

async function basicTest(driver, userName, url, log, times, numTrials ) {

    //define all the pages used in the test
    const signUpPage = new SignUpPage(driver, userName);
    const profile = new Profile(driver, userName);
    const instructionsPage = new InstructionsPage(driver, userName);
    const cardPage = new CardPage(driver,userName);
    const feedbackPage = new FeedbackPage(driver, userName);
    
    console.log(`Loading user ${userName} for ${url}`);
    await driver.get(url + "/signup");

    console.log(`(${userName}) Signing up on ${url}/signup`);
    await signUpPage.logInUser(userName);
    
    let curTime = await profile.launchFirstTdfTdf();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Launced TDF\n`

    const userId = await driver.executeScript("return Meteor.userId()")
    console.log(`userId: ${userId}`);

    curTime = await instructionsPage.contInstructions();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Submitted Informed concent\n`

    curTime = await cardPage.answerQuestionCorrect();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Answered question ${0}\n`

    curTime = await instructionsPage.contInstructions();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Left instructions page\n`

    try {
        curTime = await feedbackPage.setFeedback();
        times[userName].push(curTime);
        log[userName] += `${curTime}: Set Feedback\n`
    }
    catch (e) {
        console.log(`(${this.userName}) Feedback Selection not found, ignoring`)
    }
    
    for(let i = 0; i < numTrials; i++){
        //curTime = await cardPage.answerQuestionRandomOutcome(i + 1);
        curTime = await cardPage.answerQuestionCorrect();
        times[userName].push(curTime);
        log[userName] += `${curTime}: Answered question ${i + 1}\n`
    }
    return {times, log, userId}
};

module.exports = {
    basicTest
}