/// <reference path="../types.ts" />

import * as Promise from 'bluebird';
import * as _ from 'lodash';

var teams:TeamInfo[] = [
    {
        handle: '@Cardinals',
        name: 'St. Louis Cardinals',
        matches: ['cardinals', 'cards']
    }
]

var users:User[] = [
    {
        id: 12345,
        twitterId: 17995696,
        teams: ['@Cardinals'],
        teamInfos: null
    }
]

export function getUsers():Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
        return resolve(users.map((user) => addTeamsToUser(user)))
    })
}

function addTeamsToUser(user:User):User {
    user.teamInfos = _.filter(teams, (team) => {
        return _.includes(user.teams, team.handle)
    })
    return user
}
