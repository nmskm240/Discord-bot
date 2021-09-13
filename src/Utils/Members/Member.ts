import { IDatabaseItem } from "../../Database";
import { Game } from "./Game";

export class Member implements IDatabaseItem {
    private _tag: string;
    private _games: Game[];

    public get tag(): string { return this._tag; }
    public get games(): Game[] { return this._games; }

    constructor(tag: string, games: Game[]) {
        this._tag = tag;
        this._games = games;
    }

    public toObject(): object {
        const games = this._games.map((game) => {
            return game.toObject();
        });
        return {
            tag: this._tag,
            games: games,
        }
    }

    public static parse(obj: any): Member {
        const games: Game[] = []; 
        for(const game of obj.games) {
            games.push(Game.parse(game));
        }
        return new Member(obj.tag, games);
    }
}