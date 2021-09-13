import { IDatabaseItem } from "../../Database";

export class Game implements IDatabaseItem {
    private _name: string;
    private _id: string;

    public get name(): string { return this._name; }
    public get id(): string { return this._id; }

    constructor(name: string, id: string) {
        this._name = name;
        this._id = id;
    }

    public toObject(): object {
        return {
            name: this._name,
            id: this._id,
        }
    }

    public static parse(obj: any): Game {
        return new Game(obj.name, obj.id);
    }
}