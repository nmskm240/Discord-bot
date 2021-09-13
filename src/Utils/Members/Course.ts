export const Course = {
    Mechanical : "機械系",
    ElectricalAndComputer: "電気電子系",
    Civil: "土木系",
    Design: "情報デザイン学科",
    Architecture: "建築学科",
    None: "所属なし",
} as const

export type Course = typeof Course[keyof typeof Course];