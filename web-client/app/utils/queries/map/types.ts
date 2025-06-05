import { WizformElementType } from "@/graphql/graphql"

export type LocationSection = {
    id: string,
    name: string,
    locationsCount: number
}

export type Location = {
    id: string,
    name: string,
    entriesCount: number
}

export type LocationWizformEntry = {
    id: string,
    wizformName: string,
    wizformElement: WizformElementType,
    wizformNumber: number,
    comment: string | null
}

export type LocationFullModel = {
    wizforms: LocationWizformEntry []
}

export type SelectableWizform = {
    id: string,
    name: string,
    element: WizformElementType,
    number: number
}