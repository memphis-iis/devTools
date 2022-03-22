let SignUpPage = require('./pages/signup').SignUpPage;
let InstructionsPage = require('./pages/instructions').InstructionsPage;
let FeedbackPage = require('./pages/feedback').FeedbackPage;
let CardPage = require('./pages/card').CardPage;
let Profile = require('./pages/profile').Profile;
const numTrials = 10;

async function basicTest(driver, userName, url, log, times) {

    //define all the pages used in the test
    let signUpPage = new SignUpPage(driver, userName);
    let profile = new Profile(driver, userName);
    let instructionsPage = new InstructionsPage(driver, userName);
    let cardPage = new CardPage(driver,userName);
    let feedbackPage = new FeedbackPage(driver, userName);
    
    console.log(`Loading user ${userName} for ${url}`);
    await driver.get(url + "/signup");

    console.log(`(${userName}) Signing up on ${url}`);
    await signUpPage.logInUser(userName);
    
    let curTime = await profile.launchFirstTdfTdf();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Launced TDF\n`

    curTime = await instructionsPage.contInstructions();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Submitted Informed concent\n`

    curTime = await cardPage.answerQuestionCorrect();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Answered question ${0}\n`

    curTime = await instructionsPage.contInstructions();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Left instructions page\n`

    curTime = await feedbackPage.setFeedback();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Set Feedback\n`
    
    for(let i = 0; i < numTrials; i++){
        curTime = await cardPage.answerQuestionRandomOutcome(i + 1);
        times[userName].push(curTime);
        log[userName] += `${curTime}: Answered question ${i + 1}\n`
    }
    return {times, log}
};

module.exports = {
    basicTest
}