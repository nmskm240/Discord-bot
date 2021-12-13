export const AccessPoint = {
    NAME_LIST: process.env.NAME_LIST_API,
    FORM_DB: process.env.FORM_DB_API
} as const

export type AccessPoint = typeof AccessPoint[keyof typeof AccessPoint];