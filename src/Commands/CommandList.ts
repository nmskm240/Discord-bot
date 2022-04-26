import { ICommand, Help, Teaming, Who } from "."
import { Room } from "./Room"

export const CommandList: ICommand[] = [
    new Help(),
    new Room(),
    new Teaming(),
    new Who()
]