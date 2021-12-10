import { DTO } from "../DTO";

export class GameData extends DTO {
    title: string;
    id: string;

    constructor(title: string, id: string) {
        super();
        this.title = title;
        this.id = id;
    }

    toObject(): object {
        return {
            title: this.title,
            id: this.id
        };
    }
}