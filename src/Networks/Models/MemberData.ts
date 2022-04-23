import { StudentData, DiscordData } from "..";

export class MemberData extends StudentData {
    discord: DiscordData;

    constructor(id: number, name: string, discord: DiscordData) {
        super(id, name);
        this.discord = discord;
    }
}