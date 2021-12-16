import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import { FormType, RoomForm } from "../Forms";
import { FormTask } from "../Networks";

export class Room {
    private openForm(message: Message): void {
        const limit = new Date();
        limit.setDate(limit.getDate() + 365);
        const task = new FormTask(
            FormType.ROOM,
            message.guild!,
            message.channel!,
            message,
            message.member!,
            limit,
            []
        );
        const form = new RoomForm();
        form.setTask(task);
        form.open();
    }
    public async open(client: Client): Promise<void> {
        const channel = client.channels.cache.get("853968633889816598") as TextChannel;
        if (channel) {
            const embed = new MessageEmbed()
                .setTitle("在室者一覧")
                .setColor("BLUE")
                .addField("F202", "なし")
            const message = await channel.send(embed);
            this.openForm(message);
        }

    }
}