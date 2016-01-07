/// <reference path="../typings/request/request.d.ts" />
import * as request from 'request';
var requestPromise = Promise.promisify(request)
Promise.promisifyAll(requestPromise)

var oauth:request.OAuthOptions = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCES_TOKEN_SECRET
}

export function handleTweet(tweet:Tweet, appUserId:number):void {
    console.log('tweet', tweet)
    var tweetText = tweet.text.toLowerCase()
    var teamIHate = 'cardinals'
    if (tweet.user.id != appUserId && _.contains(tweetText, teamIHate)) {
        replyToTweet(tweet, teamIHate)
    }
}

export function isTweet(response:any):boolean {
    return !!response && !!response.text && !!response.id_str
}

function replyToTweet(tweet:Tweet, team:string):Promise<void> {
    console.log('replyToTweet', tweet.id)
    var requestData = {
        method: 'POST',
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        oauth: oauth,
        qs: {
            status: ['@'+tweet.user.screen_name, 'the', team, 'are the worst.'].join(' '),
            'in_reply_to_status_id': tweet.id,
        },
    }
    return requestPromise(requestData)
    .then((rs:any) => null)
    .catch((e) => console.log('error', e))
}

