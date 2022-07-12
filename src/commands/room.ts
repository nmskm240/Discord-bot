import { CommandInteraction, CacheType, MessageEmbed, ButtonInteraction, ApplicationCommandData } from "discord.js";
import { Command, ButtonInteractionCallback } from ".";
import { AccessPoint, Network, Room as RoomModel } from "../networks";

export class Room implements Command, ButtonInteractionCallback {
    name: string;
    description: string;

    constructor() {
        this.name = "room";
        this.description = "部室の状態を表示します";
    }

    async callback(interaction: ButtonInteraction<CacheType>) {
        await interaction.deferUpdate()
        const rooms = await Network.get<RoomModel[]>(AccessPoint.ROOM_STATE);
        if (rooms) {
            const fields = await Promise.all(rooms.map(async (room) => {
                const inmates = await interaction.guild?.members.fetch({
                    user: room.inmates.map((inmate) => {
                        return inmate.discord.id;
                    })
                });
                const value = Array.from(inmates!.values()).toString() || "空室";
                return { name: room.info.name, value: value };
            })) || [];
            const embed = new MessageEmbed({
                title: "部室利用状況",
                fields: fields,
                timestamp: Date.now()
            });
            await interaction.editReply({ embeds: [embed] });
        }
    }

    async execute(interaction: CommandInteraction<CacheType>) {
        const embed = new MessageEmbed({
            title: "部室利用状況"
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