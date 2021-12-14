import { Message, MessageEmbed } from "discord.js";
import { Command, IExecutedCallback } from ".";
import { FormType, RoomForm } from "../Forms";
import { FormTask } from "../Networks";

export class Room extends Command implements IExecutedCallback {
    constructor() {
        super(
            "room",
            "部室の入室者一覧を表示します\n",
            []
        );
    }

    public onCompleted(message: Message): void {
        const limit = new Date();
        limit.setDate(limit.getDate() + 3650);
        const task = new FormTask(
            FormType.ROOM,
            this.info.guild!,
            this.info.channel!,
            message,
            this.info.performer!,
            limit,
            [
                "✅",
                "❎",
            ]
        );
        const form = new RoomForm();
        form.setTask(task);
        form.open();
    }
    public async execute(): Promise<void> {
        this._result = new MessageEmbed()
            .setTitle("在室者一覧")
            .setColor("BLUE")
            .addField("F202", "なし")
    }
}