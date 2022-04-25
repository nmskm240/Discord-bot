import { CommandInteraction, CacheType, ApplicationCommandData, GuildMember, MessageEmbed } from "discord.js";
import { ICommand } from ".";
import { Team } from "../Utils";

export class Teaming implements ICommand {
    name: string;
    description: string;

    constructor() {
        this.name = "teaming"
        this.description = "チーム分け";
    }

    execute(interaction: CommandInteraction<CacheType>): any {
        const member = interaction.member as GuildMember;
        if (member) {
            const vc = member.voice.channel;
            const size = interaction.options.getInteger("size");
            if (vc) {
                const teams = Team.random(vc.members, size || 3);
                const fields = teams.map((team) => {
                    return { name: team.name, value: team.members.toString() };
                })
                const embed = new MessageEmbed({
                    title: "チーム分け結果",
                    fields: fields
                })
                interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply({ content: "ボイスチャンネルに参加してからコマンドを実行してください", ephemeral: true });
            }
        } else {
            interaction.reply({ content: "コマンドが正常に動作しませんでした", ephemeral: true });
        }
    }

    toCommandData(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description,
            options: [
                {
                    type: "SUB_COMMAND",
                    name: "voice",
                    description: "ボイスチャンネルのメンバーでチーム分け",
                    options: [
                        {
                            type: "INTEGER",
                            name: "size",
                            description: "1チームあたりの人数",
                            minValue: 1
                        }
                    ]
                }
            ]
        }
    }
}