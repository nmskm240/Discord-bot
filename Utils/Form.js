const discord = require("discord.js");
const Team = require("./Team")
const Network = require("./Network");

module.exports = class Form {
    constructor(answerableSize = -1) {
        this.respondents = new Team("回答者", answerableSize);
    }

    static reboot(client) {
        Network.get({ command: "recruit" })
            .then(res => {
                res.data.forEach(task => {
                    const now = new Date();
                    const end = new Date(task.endTime);
                    const reactions = {
                        allow: task.allow,
                        cancel: task.cancel,
                        close: task.close,
                    };
                    const term = {
                        date: end.getDate() - now.getDate(),
                        hour: end.getHours() - now.getHours(),
                    }
                    const guild = client.guilds.cache.get(task.guild);
                    const channel = guild.channels.cache.get(task.channel);
                    channel.messages.fetch(task.message)
                        .then(message => {
                            channel.messages.fetch(task.creatorMessage)
                                .then(cmessage => {
                                    const creator = cmessage.author;
                                    const form = new Form(task.answerable);
                                    form.creator = creator;
                                    form.open(message, reactions, term, true);
                                })
                        });
                });
            })
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

    open(message, reactions, term, isOpened = false) {
        if (!isOpened) {
            const limit = new Date();
            limit.setDate(limit.getDate() + term.date);
            limit.setHours(limit.getHours() + term.hour);
            const postData = {
                command: "recruit",
                method: "append",
                data: {
                    id: {
                        guild: message.guild.id,
                        channel: message.channel.id,
                        message: message.id,
                        creatorMessage: this.creator.lastMessage.id,
                    },
                    reactions: reactions,
                    endTime: limit,
                    answerable: this.respondents.max,
                }
            }
            Network.post(postData);
        }
        else {
            message.reactions.cache.get(reactions.allow).users.fetch()
                .then(users => {
                    this.respondents.addMembers(users.filter(user => !user.bot).array());
                    this.update(message);
                });
            if (term.hour <= 0) {
                if (term.date <= 0) {
                    this.close(message);
                    return;
                }
                term.date--;
                term.hour += 24;
            }
        }
        const reactionFilter = (reaction, user) =>
            reaction.emoji.name === reactions.allow ||
            reaction.emoji.name === reactions.cancel ||
            reaction.emoji.name === reactions.close;
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

    update(message) {
        const embed = Object.assign({}, message.embeds[0]);
        const field = embed.fields[0];
        field.value = this.respondents.isEmpty ? "なし" : this.respondents.members;
        embed.fields[0] = field;
        message.edit(new discord.MessageEmbed(embed));
    }

    close(message) {
        const embed = Object.assign({}, message.embeds[0]);
        embed.title = "募集終了";
        embed.color = "#000000";
        message.edit(new discord.MessageEmbed(embed));
        const postData = {
            command: "recruit",
            method: "delete",
            data: {
                messageID: message.id,
            }
        };
        Network.post(postData);
    }
}