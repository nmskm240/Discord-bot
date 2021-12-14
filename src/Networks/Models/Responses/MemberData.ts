import { DTO } from "../DTO";
import { DiscordData } from "./DiscordData";
import { GameData } from "./GameData";

export class MemberData extends DTO {
    id: number;
    name: string;
    discord: DiscordData;
    games: GameData[];


    constructor(id: number, name: string, discord: DiscordData, games: GameData[]) {
        super();
        this.id = id;
        this.name = name;
        this.discord = discord;
        this.games = games;
    }
}