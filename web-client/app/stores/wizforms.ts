import { create } from "zustand"
import { WizformElementType } from "../graphql/graphql"
import { WizformFull, WizformSimpleModel } from "@/utils/queries/wizforms/types"

type Data = {
    wizforms: WizformSimpleModel [] | undefined,
    elementFilter: WizformElementType | undefined,
    nameFilter: string | undefined,
    focusedWizformId: string | undefined,
    focusedWizformCollectionId: string | null | undefined
}

type Action = {
    setWizforms: (value: WizformSimpleModel []) => void,
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string) => void,
    setFocusedWizformId: (value: string) => void,
    setFocusedWizformCollectionId: (value: string | null) => void
}

const useWizformsStore = create<Data & Action>((set) => ({
    wizforms: undefined,
    elementFilter: undefined,
    nameFilter: undefined,
    focusedWizformId: undefined,
    focusedWizformCollectionId: undefined,

    setWizforms(value) {
        set({wizforms: value});
    },
    setElementFilter(value) {
        set({elementFilter: value});
    },
    setNameFilter(value) {
        set({nameFilter: value});
    },
    setFocusedWizformId(value) {
        set({focusedWizformId: value});
    },
    setFocusedWizformCollectionId(value) {
        set({focusedWizformCollectionId: value});
    },
}));

export default useWizformsStore;