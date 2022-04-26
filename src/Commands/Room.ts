import { CommandInteraction, CacheType, MessageEmbed, ButtonInteraction, Guild, ApplicationCommandData } from "discord.js";
import { ICommand, ICallbackableButtonInteraction } from ".";
import { Campus, Network, RoomData } from "../Networks";

export class Room implements ICommand, ICallbackableButtonInteraction {
    name: string;
    description: string;
    
    constructor() {
        this.name = "room";
        this.description = "部室の状態を表示します";
    }

    async callback(interaction: ButtonInteraction<CacheType>) {
        const query = new Campus("小波瀬");
        await interaction.deferUpdate()
        const room = await Network.get<RoomData>(process.env.ROOM_ACCESS_API!, query);
        if (room) {
            const inmateMembers = await interaction.guild?.members.fetch({
                user: room.inmates.map((inmate) => {
                    return inmate.discord.id;
                })
            });
            const embed = new MessageEmbed({
                title: "部室利用状況",
                fields: [{
                    name: "F02",
                    value: Array.from(inmateMembers!.values()).toString() || "空室"
                }],
                timestamp: Date.now()
            });
            await interaction.editReply({ embeds: [embed] });
        }
    }

    async execute(interaction: CommandInteraction<CacheType>) {
        const embed = new MessageEmbed({
            title: "部室利用状況",
            fields: [{
                name: "F02",
                value: "空室"
            }]
        });
        interaction.reply({
            embeds: [embed],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "BUTTON",
                            style: "SECONDARY",
                            label: "更新",
                            customId: "nBot/room/update"
                        }
                    ]
                }
            ]
        })
    }

    toCommandData(): ApplicationCommandData {
        return {
            name: this.name,
            description: this.description
        }
    }
}