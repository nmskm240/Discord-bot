import { MemberData, DiscordData, GameData } from "..";

export class MemberFullData extends MemberData {
    games: GameData[];
    
    constructor(id: number, name: string, discord: DiscordData, games: GameData[]) {
        super(id, name, discord);
        this.games = games;
    }
}