export enum WizformElementType {
    None = "NONE",
    NeutralOne = "NEUTRAL_ONE",
    Nature = "NATURE",
    Air = "AIR", 
    Water = "WATER",
    Light = "LATER",
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

export type Wizform = {
    id: string,
    name: string,
    element: number,
    desc: string,
    enabled: boolean,
    filters: number[],
    spawn_points: string[],
    icon: string,
    number: number
}

export type Filter = {
    id: string,
    book_id: string,
    name: string,
    filter_type: number,
    enabled: boolean
}
 
export type SpawnPoint = {
    id: string,
    book_id: string,
    name: string
}