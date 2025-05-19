import { create } from "zustand"
import { WizformElementType } from "../../types"

type Data = {
    elementFilter: WizformElementType,
    nameFilter: string
}

type Action = {
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string) => void
}

const useWizformsStore = create<Data & Action>((set) => ({
    elementFilter: WizformElementType.Nature,
    nameFilter: "",

    setElementFilter(value) {
        set({elementFilter: value});
    },
    setNameFilter(value) {
        set({nameFilter: value});
    },
}));

export default useWizformsStore;