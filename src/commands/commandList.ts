import { Command, Help, Room, Teaming, Who } from "."

export const CommandList: Command[] = [
    new Help(),
    new Room(),
    new Teaming(),
    new Who()
]