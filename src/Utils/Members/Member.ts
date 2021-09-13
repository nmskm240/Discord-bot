import { IDatabaseItem } from "../../Database";
import { Course } from "./Course";
import { Game } from "./Game";
import { MemberType } from "./MemberType";

export class Member implements IDatabaseItem {
    private _tag: string;
    private _course: Course;
    private _type: MemberType;
    private _games: Game[];

    public get tag(): string { return this._tag; }
    public get course(): Course { return this._course; }
    public get type(): MemberType { return this._type; }
    public get games(): Game[] { return this._games; }

    constructor(tag: string, course: Course, type: MemberType, games: Game[]) {
        this._tag = tag;
        this._course = course;
        this._type = type;
        this._games = games;
    }

    public toObject(): object {
        return {
            tag: this._tag,
            course: this._course,
            type: this._type,
            games: this._games,
        }
    }

    public static parse(obj: any): Member {
        const games: Game[] = []; 
        for(const game of obj.games) {
            games.push(Game.parse(game));
        }
        return new Member(obj.tag, obj.course, obj.type, games);
    }
}