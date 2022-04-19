import { CommandInteraction } from "discord.js";
import { Command } from "./Command";

export class Ping extends Command {
    constructor() {
        super("ping", "Replies with Pong!");
    }

    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply('Pong!');
    }
}