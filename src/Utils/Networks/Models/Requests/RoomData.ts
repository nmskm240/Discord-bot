import { DTO } from "../DTO";
import { InRoomMember } from "./InRoomMember";

export class RoomData extends DTO {
    campus: string;
    inmates: InRoomMember[];

    constructor(campus: string, inmates: InRoomMember[]) {
        super();
        this.campus = campus;
        this.inmates = inmates;
    }

    toObject(): object {
        return {
            campus: this.campus,
            inmates: this.inmates
        };
    }
}