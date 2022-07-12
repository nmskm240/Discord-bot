import { ApplicationCommandData, CommandInteraction } from "discord.js";

export interface Command {
    readonly name: string
    readonly description: string

    execute(interaction: CommandInteraction): any
    toCommandData(): ApplicationCommandData
}