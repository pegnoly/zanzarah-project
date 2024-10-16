export type Book = {
    id: string,
    name: string
}

export type Wizform = {
    id: string,
    name: string,
    desc: string,
    element: WizformElementType,
    number: number,
    magics: LevelOfMagic[],
    hitpoints: number,
    agility: number,
    jump_ability: number,
    precision: number,
    evolution_form: number,
    evolution_level: number,
    exp_modifier: number
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

export enum MagicElementType {
    None = 0,
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
    Metall = 12,
    Joker = 13,
    Error = 14
}

export type MagicSlot = {
    first_element: MagicElementType,
    second_element: MagicElementType,
    third_element: MagicElementType
}

export type LevelOfMagic = {
    level: number,
    first_active_slot: MagicSlot,
    first_passive_slot: MagicSlot,
    second_active_slot: MagicSlot,
    second_passive_slot: MagicSlot,
}