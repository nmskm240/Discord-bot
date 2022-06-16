import { DTO } from "..";

export class Discord implements DTO {
    id: string;
    nickname: string;

    constructor(id: string, nickname: string) {
        this.id = id;
        this.nickname = nickname;
    }
}