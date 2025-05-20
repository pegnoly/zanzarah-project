import { create } from "zustand"
import { UUID } from "crypto"
import { WizformElementType } from "./types"

type Data = {
    elementFilter: WizformElementType,
    nameFilter: string,
    currentSelectedId: UUID | null
}

type Action = {
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string) => void
    setCurrentId: (value: string) => void
}

const useWizformsStore = create<Data & Action>((set) => ({
    elementFilter: WizformElementType.Nature,
    nameFilter: "",
    currentSelectedId: null,

    setElementFilter(value) {
        set({elementFilter: value});
    },
    setNameFilter(value) {
        set({nameFilter: value});
    },
    setCurrentId(value) {
        set({currentSelectedId: value as UUID})
    },
}));

export default useWizformsStore;