import { Collection, GuildMember } from "discord.js";

export class Team {
    private _max: number;
    private _members: GuildMember[];
    private _name: string;

    public get isEmpty(): boolean { return this._members.length == 0; }
    public get isMax(): boolean { return this.max != -1 && this._members.length >= this.max;; }
    public get max(): number { return this._max; }
    public get members(): Iterable<GuildMember> { return this._members; }
    public get name(): string { return this._name; }

    constructor(name: string, max: number = -1) {
        this._name = name;
        this._max = max <= 0 ? -1 : max;
        this._members = [];
    }

    public add(member: GuildMember): void {
        if (!this.isMax && !this.has(member)) {
            this._members.push(member);
        }
    }

    public addAll(members: GuildMember[]): void {
        for (const member of members) {
            this.add(member);
        }
    }

    public has(member: GuildMember): boolean {
        return this._members.includes(member);
    }

    public remove(member: GuildMember): void {
        if (this.has(member)) {
            this._members.splice(this._members.indexOf(member), 1);
        }
    }

    public static random(members: Collection<string, GuildMember>, size: number): Team[] {
        const teams: Team[] = [];
        let count: number = 1;
        while (size <= members.size) {
            const team = new Team("チーム" + count, size);
            const keys = members.randomKey(size);
            for (const key of keys) {
                const member = members.get(key) as GuildMember;
                team.add(member);
                members.delete(key);
            }   
            teams.push(team);
            count++;
        }
        if (0 < members.size) {
            const team = new Team("余ったメンバー");
            const keys = members.keys();
            for (const key of keys) {
                const member = members.get(key) as GuildMember;
                team.add(member);
                members.delete(key);
            }   
            teams.push(team);
        }
        return teams;
    }
}