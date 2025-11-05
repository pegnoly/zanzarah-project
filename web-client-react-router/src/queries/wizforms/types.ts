import type { WizformElementType } from "../../graphql/graphql"

export enum MagicElementType {
    Air = 'AIR',
    Chaos = 'CHAOS',
    Dark = 'DARK',
    Energy = 'ENERGY',
    Error = 'ERROR',
    Fire = 'FIRE',
    Ice = 'ICE',
    Joker = 'JOKER',
    Light = 'LIGHT',
    Metall = 'METALL',
    Nature = 'NATURE',
    None = 'NONE',
    Psi = 'PSI',
    Stone = 'STONE',
    Water = 'WATER'
}

export type MagicSlot = {
    firstElement: MagicElementType,
    secondElement: MagicElementType,
    thirdElement: MagicElementType
}

export type Magic = {
  firstActiveSlot: MagicSlot,
  firstPassiveSlot: MagicSlot,
  level: number,
  secondActiveSlot: MagicSlot,
  secondPassiveSlot: MagicSlot,
}

export type Magics = {
    types: Magic[]
}


export type WizformFull = {
    id: string,
    name: string,
    bookId: string,
    element: WizformElementType,
    number: number,
    hitpoints: number,
    agility: number,
    jumpAbility: number,
    precision: number,
    evolutionName: string,
    previousFormName: string,
    evolutionLevel: number,
    expModifier: number,
    evolutionForm: number,
    previousForm: number,
    magics: Magics,
    inCollectionId: string | null
}

export type WizformSimpleModel = {
    id: string,
    name: string,
    icon64: string,
    number: number,
    inCollectionId: string | null
}

export type WizformHabitatModel = {
    sectionName: string,
    locationName: string,
    comment: string | null
}

export type ItemEvolutionModel = {
    itemName: string,
    itemIcon: string,
    wizformName: string,
    wizformIcon: string
}