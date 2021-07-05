const discord = require("discord.js");
const Command = require("./Command");

module.exports = class RandomTeam extends Command {
    execute(message, parameters) {
        const embed = new discord.MessageEmbed()
            .setTitle("チーム分け結果");
        this.size = 3;
        if (Array.isArray(parameters) && 1 <= parameters.length) {
            let parsed = parseInt(parameters[0], 10);
            if (!isNaN(parsed) && 0 < parsed) {
                this.size = parsed;
            }
        }
        return embed;
    }
}