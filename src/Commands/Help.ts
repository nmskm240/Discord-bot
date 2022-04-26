import { CommandInteraction, CacheType, ApplicationCommandData, MessageEmbed } from "discord.js";
import { ICommand, CommandList } from ".";

export class Help implements ICommand {
    name: string;
    description: string;
    
    constructor() {
        this.name = "help";
        this.description = "各コマンドのヘルプを表示";
    }

    execute(interaction: CommandInteraction<CacheType>) {
        const name = interaction.options.getString("command")!;
        const command = CommandList.find((command) => {
            return command.name === name
        })!;
        const embed = new MessageEmbed({
            title: command.name,
            description: command?.description
        });
        interaction.reply({ embeds: [embed], ephemeral: true });
    }

    toCommandData(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description,
            options: [
                {
                    type: "STRING",
                    name: "command",
                    description: "ヘルプを表示するコマンド",
                    required: true,
                    choices: CommandList.filter((command) => {
                        return command.name !== this.name;
                    }).map((command) => {
                        return { name: command.name, value: command.name };
                    })
                }
            ]
        }
    }
}