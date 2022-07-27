let SignUpPage = require('./pages/signup').SignUpPage;
let InstructionsPage = require('./pages/instructions').InstructionsPage;
let CardPage = require('./pages/card').CardPage;
let Profile = require('./pages/profile').Profile;
const numTrials = 15;

async function test(driver, userName, url, log, times) {
    let signUpPage = new SignUpPage(driver, userName);
    let profile = new Profile(driver, userName);
    let instructionsPage = new InstructionsPage(driver, userName);
    let cardPage = new CardPage(driver,userName);
    let averageTimeBetweenTrials;
    let sumTimeBetweenTrials = 0;

    console.log(`Loading user ${userName} for ${url}`);
    await driver.get(url + "/signup");

    console.log(`(${userName}) Signing up on ${url}`);
    await signUpPage.logInUser(userName);
    
    let curTime = await profile.launchMengTdf();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Launced TDF\n`

    curTime = await instructionsPage.contInstructions();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Submitted Informed concent\n`

    curTime = await instructionsPage.contInstructions();
    times[userName].push(curTime);
    log[userName] += `${curTime}: Left instructions page\n`
    
    for(let i = 0; i < numTrials; i++){
        curTime = await cardPage.answerMengButtonTrial(i + 1);
        times[userName].push(curTime);
        log[userName] += `${curTime}: Answered question ${i + 1}\n`

        if(i > 0){
            let timeBetweenTrials = (await driver.executeScript("return Session.get('feedbackTimeoutEnds') - Session.get('feedbackTimeoutBegins')"));
            sumTimeBetweenTrials += timeBetweenTrials;
            averageTimeBetweenTrials = sumTimeBetweenTrials / (i + 1)
            console.log(`Time between trials ${timeBetweenTrials}`)
            console.log(`Average time between trials ${averageTimeBetweenTrials}`)
        }
        lastTrialTime = curTime;
    }
    return {times, log}
};

module.exports = {
    test
}