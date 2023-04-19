import { CommandInteraction, CacheType, ApplicationCommandData, GuildMember, MessageEmbed } from "discord.js";
import { Command } from ".";
import { Team } from "../utils";

export class Teaming implements Command {
    name: string;
    description: string;

    constructor() {
        this.name = "team"
        this.description = "チーム分け";
    }

    execute(interaction: CommandInteraction<CacheType>): any {
        const member = interaction.member as GuildMember;
        if (member) {
            const vc = member.voice.channel;
            const size = interaction.options.getInteger("size");
            const exceptions = [
                interaction.options.getUser("exception-0"), 
                interaction.options.getUser("exception-1"),
                interaction.options.getUser("exception-2"), 
                interaction.options.getUser("exception-3"),
                interaction.options.getUser("exception-4"), 
            ]
            if (vc) {
                const teams = Team.random(vc.members.filter(member => !exceptions.includes(member.user)), size || 3);
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
                        },
                        {
                            type: "USER",
                            name: "exception-0",
                            description: "除外メンバー",
                        },
                        {
                            type: "USER",
                            name: "exception-1",
                            description: "除外メンバー",
                        },
                        {
                            type: "USER",
                            name: "exception-2",
                            description: "除外メンバー",
                        },
                        {
                            type: "USER",
                            name: "exception-3",
                            description: "除外メンバー",
                        },
                        {
                            type: "USER",
                            name: "exception-4",
                            description: "除外メンバー",
                        }
                    ]
                }
            ]
        }
    }
}