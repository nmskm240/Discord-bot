import discord from "discord.js";
import { Command } from "./Command";

export class RandomTeam extends Command {
    data: any;
    game: any;
    key: any;
    execute(message: any, parameters: any) {
        const parameter = this.parseParameter(message, parameters.filter((parameter: any) => !parameter.match(/^<@!/)));
        const embed = new discord.MessageEmbed()
            .setTitle("チーム分け結果");
        this.make(parameter.members, parameter.size)
            .then(teams => {
                teams.forEach((team: any) => {
                    embed.addField(team.name, team.members);
                });
                message.channel.send(embed);
            });
    }

    async make(members: any, size: any) {
        let teams;
        if (!this.game) {
            teams = utils.Team.random(members, size);
        }
        else {
            const count = Math.floor(members.length / size);
            try {
                await utils.Network.get({ command: "rank" })
                    .then((res: any) => {
                        const sortedData = res.data.sort((a: any, b: any) => b[this.game][this.key] - a[this.game][this.key]);
                        console.log(sortedData);
                        let sorted: any = [];
                        sortedData.forEach((data: any) => {
                            members.forEach((member: any) => {
                                if (member.user.tag.indexOf(data.DiscordTag) != -1) {
                                    sorted.push(member);
                                    return;
                                }
                            });
                        });
                        console.log(sorted);
                        const top = sorted.splice(0, count);
                        teams = utils.Team.random(sorted, size - 1);
                        for (let i = 0; i < top.length; i++) {
                            teams[i].max++;
                            teams[i].refresh();
                            teams[i].addMember(top[i]);
                        }
                    })
            }
            catch (e) {
                teams = utils.Team.random(members, size);
            }
        }
        return teams;
    }

    parseParameter(message: any, parameters: any) {
        const parameter = {
            size: 3,
            members: message.mentions.members.array(),
        }
        if (0 < parameters.length) {
            const parsed = parseInt(parameters[0]);
            if (!isNaN(parsed) && 0 < parsed) {
                parameter.size = parsed;
            }
            else if (isNaN(parsed)) {
                this.game = parameters[0];
                this.key = "rank";
                if (1 < parameters.length) {
                    this.key = parameters[1];
                }
            }
            if (1 < parameters.length) {
                this.game = parameters[1];
                this.key = "rank";
                if (2 < parameters.length) {
                    this.data = parameters[2];
                }
            }
        }
        return parameter;
    }
}