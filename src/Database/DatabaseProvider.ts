import Database from "nedb";
import { IDatabaseItem } from "./Model/IDatabaseItem";

export class DatabaseProvider<T extends IDatabaseItem>
{
    protected _database: Database;
    protected _name: string;

    constructor(name: string) {
        this._name = name;
        this._database = new Database({ filename: name });
        this._database.loadDatabase((error) => {
            if (error) {
                throw error;
            }
        })
    }

    public insert(item: T): void {
        this._database.insert(item.toObject());
    }

    public all(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this._database.find({}, function (error: Error | null, documents: T[]) {
                if (error) {
                    reject(error);
                } else {
                    resolve(documents);
                }
            });
        })
    }

    public find(query: object): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this._database.find(query, function (error: Error | null, documents: T[]) {
                if (error) {
                    reject(error);
                } else {
                    resolve(documents);
                }
            })
        })
    }

    public remove(query: object): void {
        this._database.remove(query);
    }

    public update(query: object, item: T, options: object = {}): void {
        this._database.update(query, item.toObject(), options);
    }
}