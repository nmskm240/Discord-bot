import { Command, Help, Teaming, Who } from "."
import { Room } from "./room"

export const CommandList: Command[] = [
    new Help(),
    new Room(),
    new Teaming(),
    new Who()
]