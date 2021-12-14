import { DTO } from "../DTO";

export class InRoomMember extends DTO {
    id: number;
    name: string;
    discordID: string;

    constructor(id: number, name: string, discordID: string) {
        super();
        this.id = id;
        this.name = name;
        this.discordID = discordID;
    }
}