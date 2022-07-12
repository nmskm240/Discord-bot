import { Command, Help, Poll, Room, Teaming, Who } from "."

export const CommandList: Command[] = [
    new Help(),
    new Poll(),
    new Room(),
    new Teaming(),
    new Who()
]