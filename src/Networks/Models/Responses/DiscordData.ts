import { DTO } from "../DTO";

export class DiscordData extends DTO {
    id: string;
    nickname: string;

    constructor(id: string, nickname: string) {
        super();
        this.id = id;
        this.nickname = nickname;
    }
}