/// <reference path="../types.ts" />

import * as Promise from 'bluebird';

var users:User[] = [
    {
        id: 12345,
        twitterId: 17995696,
        hatedTeams: ['cardinals']
    }
]

export function getUsers():Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
        return resolve(users)
    })
}
