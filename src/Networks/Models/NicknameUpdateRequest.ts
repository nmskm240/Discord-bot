import { IDto } from "./IDto";

export class NicknameUpdateRequest implements IDto {
    nickname: string;

    constructor(nickname: string) {
        this.nickname = nickname;
    }
}