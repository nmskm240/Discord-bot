import { Message } from "discord.js";
import { IOmittable } from "../IOmittable";
import { NumberParameter } from "../Required/NumberParameter";

export class OmittableNumberParameter extends NumberParameter implements IOmittable<number> {
    public default: number;

    constructor(name: string, detail: string, rule: (value: number) => boolean, defaultValue: number) {
        super(name, detail, rule);
        this.default = defaultValue;
    }

    public setValue(message: Message, index: number): void {
        try {
            super.setValue(message, index);
        } catch(error) {
            this._value = this.default;
        }
    }
}