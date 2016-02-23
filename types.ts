interface Tweet {
    id: number;
    id_str: string;
    text: string;
    source: string;
    user: TwitterUser;
}

interface TwitterUser {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    url: string;
    description: string;
    verified: boolean;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    favourites_count: number;
    statuses_count: number;
    created_at: string;
    lang: string;
}

interface User {
    id: number;
    twitterId: number;
    teams: string[];
    teamInfos: TeamInfo[];
}

interface TeamInfo {
    handle: string;
    name: string;
    matches: string[];
}
