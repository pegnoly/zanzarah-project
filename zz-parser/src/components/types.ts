export enum WizformElementType {
    None,
    NeutralOne,
    Nature,
    Air,
    Water,
    Light,
    Energy,
    Psi,
    Stone,
    Ice,
    Fire,
    Dark,
    Chaos,
    Metal,
    NeutralTwo,
    Custom1,
    Custom2,
    Custom3,
    Custom4,
    Custom5
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

export type MagicElement = {
    id: string,
    name: string,
    element: number,
    enabled: boolean
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