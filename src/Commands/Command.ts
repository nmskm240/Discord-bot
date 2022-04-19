import { ApplicationCommandData, CommandInteraction } from "discord.js";

export abstract class Command {
    readonly name: string
    readonly description: string

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    abstract execute(interaction: CommandInteraction): Promise<void>

    toCommandData(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description
        }
    }
}