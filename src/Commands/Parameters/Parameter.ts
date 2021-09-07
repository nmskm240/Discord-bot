import { Message } from "discord.js";

export abstract class Parameter<T>{
    protected _name: string;
    protected _detail: string;
    protected _isOmittable: boolean = false;
    protected _value: T | null;
    
    public get name(): string { return this._name; }
    public get detail(): string { return this._detail; }
    public get isOmittable(): boolean { return this._isOmittable; }
    public get valueOrDefault(): T | null { return this._value; }

    constructor(name: string, detail: string){
        this._name = name;
        this._detail = detail;
        this._value = null;
    }
    
    public abstract setValue(message: Message, index: number): void
}