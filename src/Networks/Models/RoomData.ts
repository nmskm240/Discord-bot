import { IDto, MemberData } from ".."

export class RoomData implements IDto {
    campus: string;
    inmates: MemberData[];

    constructor(campus: string, inmates: MemberData[]) {
        this.campus = campus;
        this.inmates = inmates;
    }
}