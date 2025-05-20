import { WizformElementType } from "../wizforms/types"

export type ElementModel = {
    id: number,
    name: string,
    enabled: boolean,
    element: WizformElementType
}