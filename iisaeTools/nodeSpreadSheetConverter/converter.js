// AutoTutor CSV to JSON coverter for Questions
// Parse CSV to JSON and save to file


// Get all Files in the directory
const fs = require('fs');
const cheerio = require('cheerio');
var files = fs.readdirSync('./to_convert/pages');
var scripts = fs.readdirSync('./to_convert/scripts');

// Loop through all files
for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var file_name = file.split('.')[0];
    var file_ext = file.split('.')[1];
    if (file_ext == 'csv') {
        console.log('Converting ' + file_name + '...');
        var scriptFile = scripts.find(x => x.split('.')[0] == file_name);
        var script = false;
        if(scriptFile) {
            script = fs.readFileSync('./to_convert/scripts/' + scriptFile, 'utf8');
        }
        var csv = fs.readFileSync('./to_convert/pages/' + file, 'utf8');
        var json = convertCSVtoJSON(csv, file_name, script);
        var output = {};
        var page = {};
        output.public = true;
        output.fallbackRout = 'nextPage';
        output.googleAPIKey = 'AIzaSyAjxoQ8qRAw88SI2H3F97TT7bPyOhxz-B0';
        output.enableScoring = true;
        output.enableAutoTutor = true;
        output.autoTutorReadsScript = true;
        output.autoTutorReadsRefutation = true;
        output.autoTutorCharacter = [
            {
                role: 'teacher',
                name: 'Cristina',
                template: 'default',
                voice: 'en-US-Standard-C',
                art: 'data:image/jpeg;base64,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',
                answersQuestions: false
            },
            {
                role: 'student',
                name: 'Jordan',
                template: 'default',
                voice: 'en-US-Standard-B',
                art: 'https://i.pinimg.com/originals/33/e8/1c/33e81c1d14c36523c4b980139b32e9a2.jpg',
                answersQuestions: true
            }
        ]
        output.characterReadsPrompts = 'Cristina';
        output.enableAnswerTags = false;
        output.autoTutorReadsPrompt = true;
        output.autoTutorReadsRespone = false;
        output.showScoring = true;
        output.feedbackTimeout = "2";
        output.enableAdaptivePages = false;
        output.enableFeedback = true;
        output.nextFlow = [];
        output.autoTutorRepeat = true;
        output.skipInterstitials = true;
        output.randomChoice = false;
        output.title = file_name;
        output.identfier = file_name;
        output.display = true;
        output.description = file_name;
        output.pages = json;
        fs.writeFileSync('./converted/' + file_name + '.json', JSON.stringify(output, null, 2));
    }
}


// Convert CSV to JSON
function convertCSVtoJSON(csv, title, script=false) {
    var lines = csv.split("\n");
    var pages = [];
    if(script) {
        var scriptLines = script.split("\n");
        scriptPage = {};
        scriptPage.type = "activity";
        scriptPage.header = title;
        scriptPage.subheader = "Introduction";
        scriptPage.text = "";
        scriptPage.nextFlow = [];
        scriptPage.questions = [{}];
        scriptPage.questions[0].type = "autotutorscript";
        scriptPage.questions[0].prompt = "";
        scriptPage.questions[0].value = 0;
        scriptPage.questions[0].feedback = "";
        scriptPage.questions[0].noRefutation = true;
        scriptPage.questions[0].autoTutorScript = [];
        for(var i = 0; i < scriptLines.length; i++) {
            var lineText = scriptLines[i].split(":")[1].replace(/\"/g, "");
            var character = scriptLines[i].split(":")[0];
            if(lineText && character) {
                var scriptLine = {
                    character: character,
                    script: lineText,
                    role: 'teacher'
                };
                scriptPage.questions[0].autoTutorScript.push(scriptLine);
            }
        }
        pages.push(scriptPage);
    }
    for (var i = 1; i < lines.length; i++) {
        var question = {};
        var currentline = lines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        var pageIndex = pages.findIndex(x => x.header == currentline[0]);
        if (pageIndex == -1) {
            page = {};
            page.header = currentline[0];
            page.questions = [];
            page.type = "activity";
            page.text = "";
            page.nextFlow = [];
            page.subheader = "subheader";
            pages.push(page);
            pageIndex = pages.length - 1;
        }
        question.prompt = currentline[2];
        question.type = 'multiChoice';
        question.value = 0;
        question.feedback = "",
        console.log(currentline);
        question.correctAnswer = currentline[3];
        question.answers = [];
        for (var j = 4; j < currentline.length; j++) {
            if(currentline[j] != "") {
                question.answers.push({
                    answer: currentline[j]
                });
            }
        }
        question.image = scrapeMediaFromURL(currentline[1], title);
        pages[pageIndex].questions.push(question);
    }

    // Return as JSON
    return pages;
}

function scrapeMediaFromURL(url, lesson_name) {
    var image = false;
    if(url) {
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", url, false ); // false for synchronous request
        xmlHttp.send( null );
        var content = xmlHttp.responseText;
        const $ = cheerio.load(content);
        image = $('img').attr('src');
        if(image) {
            urlSplit = url.split("/").slice(0,-1).join("/");
            imageUrl = urlSplit + "/" + image;
            finalUrl = "http://localhost:3000/" + lesson_name + "_" + image_name
            console.log("Scraped image: " + imageUrl);
            if(imageUrl) {
                var image_name = image.replace(" ","_");
                var image_path = "./converted/images/" + lesson_name + "_" + image_name;
                const https = require('https');
                const fs = require('fs');
                https.get(imageUrl, (response) => {
                    response.pipe(fs.createWriteStream(image_path));
                });
            }
            console.log("Scraped media from " + url + " to " + image_path);
        }
        return imageUrl || false;}
    return false;
}
