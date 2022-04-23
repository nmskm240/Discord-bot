import { DTO, MemberData } from ".."

export class RoomData extends DTO {
    campus: string;
    inmates: MemberData[];

    constructor(campus: string, inmates: MemberData[]) {
        super();
        this.campus = campus;
        this.inmates = inmates;
    }
}