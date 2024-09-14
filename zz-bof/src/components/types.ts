export type Book = {
    id: string,
    name: string
}

export type Wizform = {
    id: string,
    name: string,
    element: WizformElementType,
    hitpoints: number,
    agility: number,
    jump_ability: number,
    precision: number,
    enabled: boolean,
    filters: number[]
}

export type MagicElement = {
    id: string,
    name: string,
    element: WizformElementType,
    enabled: boolean
}

export type Filter = {
    id: string,
    book_id: string,
    name: string,
    filter_type: number,
    enabled: boolean
}

export enum WizformElementType {
    None = -1,
    NeutralOne = 0,
    Nature = 1,
    Air = 2,
    Water = 3,
    Light = 4,
    Energy = 5,
    Psi = 6,
    Stone = 7,
    Ice = 8,
    Fire = 9,
    Dark = 10,
    Chaos = 11,
    Metal = 12,
    NeutralTwo = 13,
    Custom1 = 14,
    Custom2 = 15,
    Custom3 = 16,
    Custom4 = 17,
    Custom5 = 18
}
