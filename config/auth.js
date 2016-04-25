// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '497040793837169', // your App ID
        'clientSecret'  : 'b15f5dbcc3ceb61ae62507fc6850912a', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'KlI1cb7uZMj31j4vRR2kkLQn1',
        'consumerSecret'    : 'W4bHJIzLpFwRRt9WTMk0m4u7Rc61DDCxPKY3tBxJC6bZT2QKxD',
        'callbackURL'       : 'http://127.0.0.1:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '793093289729-srjohubuetahid14i532s5il86slmp0m.apps.googleusercontent.com',
        'clientSecret'  : 'KsxgA6KdMUz1ginexbTrNgwy',
        'callbackURL'   : 'http://127.0.0.1:8080/auth/google/callback'
    }

};