import { DTO } from "../DTO";

export class NoneResponse extends DTO {
    toObject(): object {
        return new Object;
    }
}