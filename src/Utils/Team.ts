import { GuildMember } from "discord.js";

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

    public addMember(member: GuildMember): void {
        if (!this.isMax && !this.hasMember(member)) {
            this._members.push(member);
        }
    }

    public addMembers(members: GuildMember[]): void {
        for (const member of members) {
            this.addMember(member);
        }
    }

    public hasMember(member: GuildMember): boolean {
        return this._members.includes(member);
    }

    public removeMember(member: GuildMember): void {
        if (this.hasMember(member)) {
            this._members.splice(this._members.indexOf(member), 1);
        }
    }

    public static random(members: GuildMember[], size: number): Team[] {
        const teams: Team[] = [];
        let count: number = 1;
        while (size <= members.length) {
            let team = new Team("チーム" + count, size);
            while (!team.isMax) {
                let index = Math.floor(Math.random() * members.length);
                team.addMember(members[index]);
                members.splice(index, 1);
            }
            teams.push(team);
            count++;
        }
        if (0 < members.length) {
            let team = new Team("余ったメンバー");
            team.addMembers(members);
            teams.push(team);
        }
        return teams;
    }
}