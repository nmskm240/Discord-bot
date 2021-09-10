import { Client } from "discord.js";
import { DatabaseProvider } from "../Database";
import { FormTask } from "./FormTask";

export class FormTaskDatabase extends DatabaseProvider<FormTask> {
    private static _instance: FormTaskDatabase = new FormTaskDatabase();
    private _client: Client | null = null;

    public static get instance(): FormTaskDatabase {
        return this._instance;
    }

    private constructor() {
        super("form_task");
    }

    public init(client: Client): void {
        this._client = client;
    }

    protected async parseAll(documents: any[]): Promise<FormTask[]> {
        if(!this._client) {
            throw new Error("Client does not exist");
        }
        const tasks: FormTask[] = [];
        for(const task of documents) {
            tasks.push(await  FormTask.parse(this._client, task));
        }
        return tasks;
    }
}