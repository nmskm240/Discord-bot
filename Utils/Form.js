const discord = require("discord.js");
const Team = require("./Team")

module.exports = class Form {
    constructor(answerableSize = -1) {
        this.respondents = new Team("回答者", answerableSize);
    }

    create(title, body, fieldName, creator) {
        this.creator = creator;
        const embed = new discord.MessageEmbed()
            .setTitle(title)
            .setDescription(body)
            .setColor("#00a2ff")
            .addField(fieldName, "なし")
        return embed;
    }

    open(message, reactions, term) {
        const reactionFilter = (reaction, user) =>
            reaction.emoji.name === reactions.allow ||
            reaction.emoji.name === reactions.cancel ||
            reaction.emoji.name === reactions.end;
        const collector = message
            .createReactionCollector(reactionFilter, {
                time: (term.date * 24 * 60 * 60 * 1000) +
                    (term.hour * 60 * 60 * 1000)
            });
        collector.on("collect", (reaction, user) => {
            if (reaction.emoji.name === reactions.allow) {
                this.respondents.addMember(user);
                console.log(this.respondents.isMax);
                if (this.respondents.isMax) {
                    collector.stop();
                }
            }
            else if (reaction.emoji.name === reactions.cancel) {
                this.respondents.removeMember(user);
                const userReactions = reaction.message.reactions.cache.filter(reaction =>
                    reaction.users.cache.has(user.id) &&
                    (reaction.emoji.name === reactions.allow ||
                        reaction.emoji.name === reactions.cancel));
                try {
                    for (const reaction of userReactions.values()) {
                        reaction.users.remove(user.id);
                    }
                } catch (error) {
                    console.error('Failed to remove reactions.');
                }
            }
            else {
                if (user.id == this.creator.id) {
                    collector.stop();
                    return;
                }
            }
            this.update(message);
        });
        collector.on("end", collection => {
            this.close(message);
        });
    }

    update(message){
        const embed = Object.assign({}, message.embeds[0]);
        const field = embed.fields[0];
        field.value = this.respondents.isEmpty ? "なし" : this.respondents.members;
        embed.fields[0] = field;
        message.edit(new discord.MessageEmbed(embed));
    }

    close(message){
        const embed = Object.assign({}, message.embeds[0]);
        embed.title = "募集終了";
        embed.color = "#000000";
        message.edit(new discord.MessageEmbed(embed));
    }
}