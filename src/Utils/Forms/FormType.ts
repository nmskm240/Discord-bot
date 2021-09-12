export const FormType = {
    Recruit: "recruit",
} as const

export type FormType = typeof FormType[keyof typeof FormType];