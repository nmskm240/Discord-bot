import { Form, FormType, RecruitForm, RoomForm } from ".";
import { IFactory } from "../Utils";

export class FormFactory implements IFactory<Form> {
    public create(type: FormType): Form {
        switch(type) {
            case FormType.RECRUIT: 
                return new RecruitForm();
            case FormType.ROOM:
                return new RoomForm();
        }
    }
}