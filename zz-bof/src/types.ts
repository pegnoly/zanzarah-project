export type Book = {
    id: string,
    name: string
}

export enum MagicSlotType {
    NotExist = "NOT_EXIST",
    Active = "ACTIVE",
    Passive = "PASSIVE"
}

export type Magic = {
    level: number,
    slot_type: MagicSlotType,
    slot_number: number,
    first_element: MagicElementType,
    second_element: MagicElementType,
    third_element: MagicElementType
}

export type Magics = {
    types: Magic[]
}

export type Wizform = {
    name: string,
    description: string,
    element: WizformElementType,
    number: number,
    magics: Magics,
    hitpoints: number,
    agility: number,
    jump_ability: number,
    precision: number,
    evolution_form: number,
    evolution_level: number,
    exp_modifier: number,
    icon64: string
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
    None = "NONE",
    NeutralOne = "NEUTRAL_ONE",
    Nature = "NATURE",
    Air = "AIR",
    Water = "WATER",
    Light = "LIGHT",
    Energy = "ENERGY",
    Psi = "PSI",
    Stone = "STONE",
    Ice = "ICE",
    Fire = "FIRE",
    Dark = "DARK",
    Chaos = "CHAOS",
    Metall = "METALL",
    NeutralTwo = "NEUTRAL_TWO",
    Custom1 = "CUSTOM_1",
    Custom2 = "CUSTOM_2",
    Custom3 = "CUSTOM_3",
    Custom4 = "CUSTOM_4",
    Custom5 = "CUSTOM_5"
}

export enum MagicElementType {
    None = "NONE",
    Nature = "NATURE",
    Air = "AIR",
    Water = "WATER",
    Light = "LIGHT",
    Energy = "ENERGY",
    Psi = "PSI",
    Stone = "STONE",
    Ice = "ICE",
    Fire = "FIRE",
    Dark = "DARK", 
    Chaos = "CHAOS",
    Metall = "METALL",
    Joker = "JOKER",
    Error = "ERROR"
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