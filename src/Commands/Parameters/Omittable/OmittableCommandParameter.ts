import { Message } from "discord.js";
import { IOmittable } from "../IOmittable";
import { CommandParameter } from "..";

export class OmittableCommandParameter extends CommandParameter implements IOmittable<string> {
    public default: string;

    constructor(name: string, detail: string, defaultValue: string) {
        super(name, detail);
        this.default = defaultValue;
    }

    public setValue(message: Message, index: number): void {
        try {
            super.setValue(message, index);
        } catch (error) {
            this._value = this._factory.create(this.default);
        }
    }
}