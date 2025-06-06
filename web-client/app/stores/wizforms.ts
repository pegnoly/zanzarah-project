import { create } from "zustand"
import { WizformElementType } from "../graphql/graphql"
import { WizformFull, WizformSimpleModel } from "@/utils/queries/wizforms/types"

type Data = {
    wizforms: WizformSimpleModel [] | undefined,
    elementFilter: WizformElementType | undefined,
    nameFilter: string | undefined,
    focusedWizform: WizformFull | undefined
}

type Action = {
    setWizforms: (value: WizformSimpleModel []) => void,
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string) => void,
    setFocusedWizform: (value: WizformFull) => void
}

const useWizformsStore = create<Data & Action>((set) => ({
    wizforms: undefined,
    elementFilter: undefined,
    nameFilter: undefined,
    focusedWizform: undefined,

    setWizforms(value) {
        set({wizforms: value});
    },
    setElementFilter(value) {
        set({elementFilter: value});
    },
    setNameFilter(value) {
        set({nameFilter: value});
    },
    setFocusedWizform(value) {
        set({focusedWizform: value});
    },
}));

export default useWizformsStore;