var express = require("express");
var router = express.Router();
var Slack = require('node-slack');
var axios = require('axios');

// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console



//root route
router.get("/", function (req, res) {
    res.render("index");
});

router.get("/game", function (req, res) {
    res.render("game");
});

router.post("/test", function(req, res){
    console.log("/TEST")
    const accountSid = 'accountSid';
    const authToken = 'authToken';
    const client = require('twilio')(accountSid, authToken);
    console.log(req.body.users)
    const numbers = req.body.users;
    const msg = "This is a test to make sure this number works.";
        
    numbers.forEach((n) => 
        client.messages
    .create({from: '+19179701050', body: msg, to: n.number}));

    res.status(200).json({success: true});
});

router.post("/verify", async (req, res) => {
    const accountSid = 'accountSid';
    const authToken = 'authToken';
    const client = require('twilio')(accountSid, authToken);

    data = await client.lookups.v1.phoneNumbers(req.body.number).fetch()
    res.status(200).json(data);
});

router.post("/game", function(req, res){
    //
    //var slack = new Slack("https://hooks.slack.com/services/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");
    var config = {
        method: 'get',
        url: 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&grnlimit=1',
        headers: { 
            'Cookie': 'GeoIP=US:VA:Ashburn:39.05:-77.47:v4; WMF-Last-Access-Global=10-Jul-2021; WMF-Last-Access=10-Jul-2021'
        }
    };

    axios(config)
        .then(function (response) {
        pages = response.data.query.pages
        values = (Object.values(pages)[0])
        res.status(200).json({
            pageid: values.pageid,
            title: values.title
        });

        const accountSid = 'accountSid';
        const authToken = 'authToken';
        const client = require('twilio')(accountSid, authToken);
        console.log(req.body.users)
        const numbers = shuffle(req.body.users);

        // The Researcher
        const researchmsg = "You are The Researcher. Start a timer for 60 seconds. After, ask the crowd questions to find out what {" + values.title + "} is. If you find the truth, you get a point.";
        const researchnum = numbers.pop()
        client.messages.create({from: '+19179701050', body: researchmsg, to: researchnum.number});

        // The Truth
        const truthmsg = "You are The Truth. Read this article: https://en.wikipedia.org/?curid=" + values.pageid + " and after the minute is up, answer The Researcher's questions from your memory. If they guess you, you get a point.";
        const truthnum = numbers.pop()
        client.messages.create({from: '+19179701050', body: truthmsg, to: truthnum.number});

        // The Crowd
        const msg = "You are The Noise. In the next 60 seconds, come up with a convincing lie about what {" + values.title + "} is. If you fool The Researcher, you get two points!";
            
        numbers.forEach((n) => 
            client.messages
        .create({from: '+19179701050', body: msg, to: n.number}));

        //https://en.wikipedia.org/?curid=4502379
    }).catch(function (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
});

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

module.exports = router;