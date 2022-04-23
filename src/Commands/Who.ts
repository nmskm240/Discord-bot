import { ApplicationCommandData, CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from ".";
import { ID, MemberFullData, Network } from "../Networks";

export class Who extends Command {
    constructor() {
        super("who", "対象ユーザーのゲーム内IDを表示")
    }

    async execute(interaction: CommandInteraction) {
        const user = interaction.options.getUser("target") || interaction.user;
        const query = new ID(user.id);
        await interaction.deferReply();
        const data = await Network.get<MemberFullData>(process.env.NAME_LIST_API!, query);
        if (data) {
            const fields = data.games.filter((game) => {
                return game.id.length != 0;
            }).map((game) => {
                return { name: game.title, value: game.id }
            });
            const embed = new MessageEmbed({
                title: data.discord.nickname,
                color: user.hexAccentColor || 0,
                image: {url: user.displayAvatarURL() },
                fields: fields,
            });
            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply({ content: `${user.username}は名簿に登録されていません` })
        }
    }

    toCommandData(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description,
            options: [
                {
                    type: "USER",
                    name: "target",
                    description: "対象とするユーザー",
                }
            ]
        }
    }
}