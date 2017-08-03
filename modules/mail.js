var mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
var mailcomposer = require('mailcomposer');

function sendMail(mailData){
    // var mail = mailcomposer({
    // from: 'you@samples.mailgun.org',
    // to: 'mm@samples.mailgun.org',
    // subject: 'Test email subject',
    // text: 'Test email text',
    // html: '<b> Test email text </b>'
    // });

    var mail = mailcomposer(mailData);
    
    mail.build(function(mailBuildError, message) {
    
        // var dataToSend = {
        //     to: 'mm@samples.mailgun.org',
        //     message: message.toString('ascii')
        // };

        var dataToSend = {
            to: mailData.to,
            message: message.toString('ascii')
        };
    
        mailgun.messages().sendMime(dataToSend, function (sendError, body) {
            if (sendError) {
                console.log(sendError);
                return;
            }
        });
    });
}

module.exports = {
    sendMime: sendMail
}