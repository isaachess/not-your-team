/// <reference path="./typings/node/node.d.ts" />
/// <reference path="./typings/request/request.d.ts" />

import * as request from 'request';
import * as fs from 'fs';

var url = 'https://userstream.twitter.com/1.1/user.json'
var oauth:request.OAuthOptions = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCES_TOKEN_SECRET
}

request.get({url: url, oauth:oauth})
.on('response', (response) => {
    response.on('data', (data) => console.log('data', data.toString('utf8')))
})
