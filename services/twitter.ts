/// <reference path="../typings/request/request.d.ts" />
import * as request from 'request';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

var requestPromise = Promise.promisify(request)
Promise.promisifyAll(requestPromise)

var oauth:request.OAuthOptions = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCES_TOKEN_SECRET
}

export function handleTweet(tweet:Tweet, user:User):Promise<void>[] {
    if (tweet.user.id != user.twitterId) {
        let tweetText:string = tweet.text.toLowerCase();
        let teamsInTweet:TeamInfo[] = findTeamsInTweet(tweetText, user.teamInfos)
        return teamsInTweet.map((team:TeamInfo) => replyToTweet(tweet, team))
    }
}

export function isTweet(response:any):boolean {
    return !!response && !!response.text && !!response.id_str
}

function replyToTweet(tweet:Tweet, teamInfo:TeamInfo):Promise<void> {
    var requestData = {
        method: 'POST',
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        oauth: oauth,
        qs: {
            status: ['@'+tweet.user.screen_name, 'the', teamInfo.handle, 'are the worst.'].join(' '),
            'in_reply_to_status_id': tweet.id,
        },
    }
    return requestPromise(requestData)
    .then((rs:any) => null)
    .catch((e) => console.log('error', e))
}

function findTeamsInTweet(tweetText:string, teamInfos:TeamInfo[]):TeamInfo[] {
    return _.filter(teamInfos, (teamInfo:TeamInfo) => {
        return _.some(_.map(teamInfo.matches, (match:string) => _.includes(tweetText, match)))
    })
}
