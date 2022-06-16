import { ButtonInteractionCallback } from "../commands";

export class TypeGuards {
    static isCallbackableButtonInteraction(arg: any): arg is ButtonInteractionCallback {
        return typeof arg.callback === "function";
    }
}