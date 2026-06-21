import { create } from "zustand"
import { ElementModel } from "./types"

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