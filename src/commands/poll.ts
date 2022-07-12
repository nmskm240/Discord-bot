import { CommandInteraction, CacheType, ApplicationCommandData, ApplicationCommandChoicesData, MessageEmbed, GuildMember, Interaction, ApplicationCommandOptionChoice, CommandOptionChoiceResolvableType, Emoji, Message } from "discord.js";
import { Command } from "."

const REACTIONS = ["0⃣", "1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"]
const RANKING = [":first_place:", ":second_place:", ":third_place:"]

export class Poll implements Command {
    name: string;
    description: string;

    constructor() {
        this.name = "poll";
        this.description = "リアクションベースの投票フォームを作成します";
    }

    async execute(interaction: CommandInteraction<CacheType>) {
        if ("open" == interaction.options.getSubcommand()) {
            const title = interaction.options.getString("title", true);
            const choices = REACTIONS.map((value, index) => {
                return { reaction: value, text: interaction.options.getString(`choice_${index}`) };
            }).filter((choice) => {
                return choice.text;
            });
            const description = choices.map((choice) => {
                return `${choice.reaction} ${choice.text}`;
            }).join("\n");
            const embed = new MessageEmbed({
                title: title,
                description: description,
                color: "BLUE",
            });
            interaction.reply({ embeds: [embed] });
            const message = await interaction.fetchReply() as Message;
            for (const choice of choices) {
                await message.react(choice.reaction);
            }
            embed.footer = { text: `id: ${message.id}` };
            interaction.editReply({ embeds: [embed] });
        } else {
            const id = interaction.options.getString("id", true);
            const message = interaction.channel?.messages.cache.get(id) ??
                await interaction.channel?.messages.fetch(id);
            if (!message || message.interaction?.commandName != this.name) {
                interaction.reply({ content: "指定されたidの投票フォームは見つかりませんでした", ephemeral: true })
                return
            }
            const form = message.embeds.at(0)!;
            form.footer = { text: "投票は締め切られました" };
            form.color = 0;
            message.edit({ embeds: [form] });
            const validVotes = message.reactions.cache.filter((reaction) => {
                return REACTIONS.includes(reaction.emoji.name!);
            });
            const validVotesCount = validVotes.reduce((sum, element) => {
                return sum + element.count - 1;
            }, 0);
            const receivedVotes = validVotes.map((value) => {
                return { reaction: value.emoji.name, count: value.count - 1, raito: (value.count - 1) / validVotesCount };
            }).sort((a, b) => b.count - a.count);
            const choices = form.description!.split("\n");
            const fields = receivedVotes.map((value, index) => {
                let choice = choices.find((c) => {
                    return c.includes(value.reaction!);
                });
                choice += `(${value.count})票`;
                if (index < 3) {
                    choice += `${RANKING[index]}`;
                    choice = `**${choice}**`;
                }
                const raitoBar = "\`\`\`" + value.raito * 100 + "%\`\`\`".padEnd(value.raito * 100, "\\|");
                return { name: choice!, value: raitoBar };
            });
            const embed = new MessageEmbed({
                title: form.title!,
                fields: fields,
            });
            interaction.reply({ embeds: [embed] });
        }
    }

    toCommandData(): ApplicationCommandData {
        let commandOptions: ApplicationCommandChoicesData[] = []
        commandOptions.push({
            type: "STRING",
            name: "title",
            description: "投票フォームのタイトル",
            required: true
        });
        for (let i = 0; i < 10; i++) {
            commandOptions.push({
                type: "STRING",
                name: "choice_" + i,
                description: "選択肢",
                required: i < 2
            })
        }
        return {
            name: this.name,
            description: this.description,
            options: [
                {
                    type: "SUB_COMMAND",
                    name: "open",
                    description: "投票フォームを作成",
                    options: commandOptions
                },
                {
                    type: "SUB_COMMAND",
                    name: "close",
                    description: "投票フォームを集計",
                    options: [
                        {
                            type: "STRING",
                            name: "id",
                            description: "集計するフォームのID",
                            required: true
                        }
                    ]
                }
            ]
        }
    }
}