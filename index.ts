/// <reference path="./typings/node/node.d.ts" />
/// <reference path="./typings/request/request.d.ts" />
/// <reference path="./typings/lodash/lodash.d.ts" />
/// <reference path="./typings/bluebird/bluebird.d.ts" />
/// <reference path="./typings/express/express.d.ts" />
/// <reference path="./types.ts" />

import * as Promise from 'bluebird';
import * as request from 'request';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as express from 'express';
import * as path from 'path';
import {getUsers} from './model/user'
import {isTweet, handleTweet} from './services/twitter'

///////////////////////////
/// Express app ///////////
///////////////////////////

var app = express()
var port = 3000

// Add resources

app.use('/scripts', express.static('./node_modules'))
app.use('/app', express.static('./front-end/app'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './front-end/index.html'))
})

app.listen(port)
console.log('app listening on port', port)

///////////////////////////
/// Start user streams ////
///////////////////////////

var userStreamUrl = 'https://userstream.twitter.com/1.1/user.json'
var oauth:request.OAuthOptions = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCES_TOKEN_SECRET
}

getUsers().then((users:User[]) => {
    users.forEach((user:User) => listenToUserStream(user))
})

function listenToUserStream(user:User):void {
    console.log('listening to user stream for user', user.id)
    request.get({url: userStreamUrl, oauth:oauth}).on('response', (response) => {
        var tweetBuffer;
        response.on('data', (data) => {

            if (!tweetBuffer) tweetBuffer = data
            else tweetBuffer = combineBuffers(tweetBuffer, data)

            var validJson = bufferToJson(tweetBuffer)
            if (!!validJson) {
                tweetBuffer = null
                if (isTweet(validJson)) handleTweet(validJson, user)
            }
        })
    })
}


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

