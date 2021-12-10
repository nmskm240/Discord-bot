import { DTO } from "../DTO";

export class DiscordID extends DTO {
    id: string = "";

    constructor(id: string) {
        super();
        this.id = id;
    }

    toObject(): object {
        return {
            id: this.id
        };
    }
}