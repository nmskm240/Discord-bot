import { IExecutedCallback } from "../Commands";

export class TypeGuird {
    static isIExecutedCallback(obj: any): obj is IExecutedCallback {
        return typeof obj.onCompleted === "function";
    }
}