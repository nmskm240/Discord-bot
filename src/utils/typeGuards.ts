import { ButtonInteractionCallback } from "../commands";

export class TypeGuards {
    static isButtonInteractionCallback(arg: any): arg is ButtonInteractionCallback {
        return typeof arg.callback === "function";
    }
}