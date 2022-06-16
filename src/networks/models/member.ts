import { Discord, Game } from "..";

export class Member {
    id: number;
    name: string;
    discord: Discord;
    games: Game[];

    constructor(id: number, name: string, discord: Discord, games: Game[]) {
        this.id = id;
        this.name = name;
        this.discord = discord;
        this.games = games;
    }
}