import { ButtonInteraction } from "discord.js";

export interface ButtonInteractionCallback {
    callback(interaction: ButtonInteraction): any
}