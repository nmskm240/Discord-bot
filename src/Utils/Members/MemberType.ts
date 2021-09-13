export const MemberType = {
    Student: "学生",
    Faculty: "教職員",
} as const

export type MemberType = typeof MemberType[keyof typeof MemberType];