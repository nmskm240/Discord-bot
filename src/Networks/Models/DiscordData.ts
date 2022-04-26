import { IDto } from "..";

export class DiscordData implements IDto {
    id: string;
    nickname: string;

    constructor(id: string, nickname: string) {
        this.id = id;
        this.nickname = nickname;
    }
}