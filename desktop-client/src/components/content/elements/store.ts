import { UUID } from "crypto"
import { WizformElementType } from "../../types"
import { create } from "zustand"

export type ElementModel = {
    id: UUID,
    name: string,
    enabled: boolean,
    element: WizformElementType
}

type Data = {
    elements: ElementModel[]
}

type Action = {
    setElements: (value: ElementModel[]) => void
}

const useElementsStore = create<Data & Action>((set) => ({
    elements: [],

    setElements(value) {
        set({elements: value})
    },
}));

export default useElementsStore;