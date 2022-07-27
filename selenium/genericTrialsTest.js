const { SignUpPage } = require('./pages/signup');
const { Profile } = require('./pages/profile');
const { InstructionsPage } = require('./pages/instructions');
const { FeedbackPage } = require('./pages/feedback');
const { CardPage } = require('./pages/card');
const pgp = require('pg-promise')();
const connectionString = 'postgres://mofacts:test101@localhost:65432';
const db = pgp(connectionString);

async function test(driver, userName, url, log, times, numTrials) {

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
    await callback(times, userName, userId);
    return {times, log};
};

async function callback(times, userName, userId){
    console.log(`Time to complete trial: ${times[userName][times[userName].length - 1] - times[userName][0]}ms`)
    console.log(`Time to load TDF: ${times[userName][1] - times[userName][0]}ms`);
    const query = 'SELECT * FROM HISTORY WHERE userId=$1 ORDER BY eventid asc';
    const history = await db.manyOrNone(query, userId);
    for(his of history){
        console.log('eventId', his.eventid);
        console.log('itemid', his.itemid);
        console.log('recordedservertime', his.recordedservertime);
        console.log('totalservertime', parseInt(his.cf_feedback_latency) + parseInt(his.cf_start_latency) + parseInt(his.cf_end_latency));
        console.log('outcome', his.outcome);
        console.log('cf_response_time', his.cf_response_time);
        console.log('cf_start_latency', his.cf_start_latency);
        console.log('cf_end_latency', his.cf_end_latency);
        console.log('cf_feedback_latency', his.cf_feedback_latency);
        console.log('feedback_text', his.feedback_text);
        console.log('hintlevel', his.hintlevel);
        console.log()
    }
    console.log(history[0])
}

module.exports = {
    test
}