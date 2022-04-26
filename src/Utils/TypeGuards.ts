import { ICallbackableButtonInteraction } from "../Commands";

export class TypeGuards {
    static isCallbackableButtonInteraction(arg: any): arg is ICallbackableButtonInteraction {
        return typeof arg.callback === "function";
    }
}