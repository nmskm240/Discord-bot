import { IExecutedCallback } from "../Commands";

export class TypeGuard {
    static isIExecutedCallback(obj: any): obj is IExecutedCallback {
        return typeof obj.onCompleted === "function";
    }
}