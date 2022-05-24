export const AccessPoint = {
    MEMBER_SEARCH: "member",
    MEMBER_REGISTER: "member/register",
    MEMBER_UPDATE: "member/update",
    ROOM_STATE: "room",
} as const

export type AccessPoint = typeof AccessPoint[keyof typeof AccessPoint]