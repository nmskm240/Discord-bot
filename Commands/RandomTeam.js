const discord = require("discord.js");
const requireDir = require("require-dir");
const utils = requireDir("../Utils");
const Command = require("./Command");

module.exports = class RandomTeam extends Command {
    execute(message, parameters) {
        const parameter = this.parseParameter(message, parameters.filter(parameter => !parameter.match(/^<@!/)));
        const embed = new discord.MessageEmbed()
            .setTitle("チーム分け結果");
        this.make(parameter.members, parameter.size)
            .then(teams => {
                teams.forEach(team => {
                    embed.addField(team.name, team.members);
                });
                message.channel.send(embed);
            });
    }

    async make(members, size) {
        let teams;
        if (!this.game) {
            teams = utils.Team.random(members, size);
        }
        else {
            const count = Math.floor(members.length / size);
            try {
                await utils.Network.get({ command: "rank" })
                    .then(res => {
                        const sortedData = res.data.sort((a, b) => b[this.game][this.key] - a[this.game][this.key]);
                        console.log(sortedData);
                        let sorted = [];
                        sortedData.forEach(data => {
                            members.forEach(member => {
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

    parseParameter(message, parameters) {
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