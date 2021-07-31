const discord = require("discord.js");
const requireDir = require("require-dir");
const utils = requireDir("../Utils");
const Command = require("./Command");

module.exports = class RandomTeam extends Command {
    execute(message, parameters) {
        const parameter = this.parseParameter(message, parameters);
        const embed = new discord.MessageEmbed()
            .setTitle("チーム分け結果");
        this.make(parameter.members, parameter.size).forEach(team => {
            embed.addField(team.name, team.members);
        });
        message.channel.send(embed);
        return embed;
    }

    make(members, size) {
        return utils.Team.random(members, size);
    }

    parseParameter(message, parameters) {
        const parameter = {
            size: 3,
            members: message.mentions.members.array(),
        }
        const parsed = parseInt(parameters[0]);
        if (!isNaN(parsed) && 0 < parsed) {
            parameter.size = parsed;
        }
        return parameter;
    }
}