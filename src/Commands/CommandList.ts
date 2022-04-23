import { Command, Help, Teaming, Who } from "."
import { Room } from "./Room"

export const CommandList: Command[] = [
    new Help(),
    new Room(),
    new Teaming(),
    new Who()
]