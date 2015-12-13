/// <reference path="./typings/node/node.d.ts" />
/// <reference path="./typings/request/request.d.ts" />
/// <reference path="./typings/lodash/lodash.d.ts" />
/// <reference path="./typings/bluebird/bluebird.d.ts" />

import * as Promise from 'bluebird';
import * as request from 'request';
import * as fs from 'fs';
import * as _ from 'lodash';

var requestPromise = Promise.promisify(request)
Promise.promisifyAll(requestPromise)

interface Tweet {
    id: number;
    id_str: string;
    text: string;
}

var url = 'https://userstream.twitter.com/1.1/user.json'
var oauth:request.OAuthOptions = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCES_TOKEN_SECRET
}

request.get({url: url, oauth:oauth}).on('response', (response) => {
    var tweetBuffer;
    response.on('data', (data) => {
        if (!tweetBuffer) tweetBuffer = data
        else tweetBuffer = combineBuffers(tweetBuffer, data)

        var tweet = bufferToJson(tweetBuffer)
        if (!!tweet) {
            tweetBuffer = null
            if (isTweet(tweet)) return handleTweet(tweet)
        }
    })
})

function combineBuffers(oldBuffer:any, newBuffer:any):any {
    return Buffer.concat([oldBuffer, newBuffer])
}

function bufferToJson(buffer):any {
    try {
        var data = buffer.toString('utf8')
        return JSON.parse(data)
    }
    catch(e) {
        return null
    }
}

function handleTweet(tweet:Tweet):void {
    console.log('tweet', tweet)
    var tweetText = tweet.text.toLowerCase()
    var teamIHate = 'cardinals'
    if (_.contains(tweetText, teamIHate)) {
        console.log('i hate the cardinals')
        replyToTweet(tweet, teamIHate)
    }
}

function replyToTweet(tweet:Tweet, team:string):any {
}

function isTweet(response:any):boolean {
    return !!response && !!response.text && !!response.id_str
}
