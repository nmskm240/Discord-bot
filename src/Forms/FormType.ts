export const FormType = {
    RECRUIT: "recruit",
    ROOM: "room"
} as const

export type FormType = typeof FormType[keyof typeof FormType];