import Database from "nedb";
import { IDatabaseItem } from "./Model/IDatabaseItem";

export abstract class DatabaseProvider<T extends IDatabaseItem>
{
    private readonly path: string = "./Data/";
    private readonly extension: string = ".db";

    protected _database: Database;
    protected _name: string;

    constructor(name: string) {
        this._name = name;
        this._database = new Database({ filename: this.path + name + this.extension });
        this._database.loadDatabase((error) => {
            if (error) {
                throw error;
            }
        })
    }

    protected abstract parseAll(documents: any[]): Promise<T[]>

    public insert(item: T): void {
        this._database.insert(item.toObject());
    }

    public all(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this._database.find({},  (error: Error | null, documents: any[]) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.parseAll(documents));
                }
            });
        })
    }

    public find(query: object): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this._database.find(query, (error: Error | null, documents: any[]) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(this.parseAll(documents));
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