import { DTO } from "../DTO";

export class DiscordData extends DTO {
    id: string;
    nickname: string;
    tag: string;

    constructor(id: string, nickname: string, tag: string) {
        super();
        this.id = id;
        this.nickname = nickname;
        this.tag = tag;
    }

    toObject(): object {
        return {
            id: this.id,
            nickname: this.nickname,
            tag: this.tag
        };
    }
}