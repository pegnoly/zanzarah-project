import {create} from 'zustand'
import { WizformElementType } from '../graphql/graphql'

type Data = {
    wizformsDisabled: boolean,
    currentElementFilter: WizformElementType,
    currentNameFilter: string | undefined
}

type Action = {
    setWizformsDisabled: (value: boolean) => void,
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string) => void
}

export const useCommonStore = create<Data & Action>((set) => ({
    wizformsDisabled: false,
    currentElementFilter: WizformElementType.Nature,
    currentNameFilter: undefined,

    setWizformsDisabled(value) {
        set({wizformsDisabled: value});
    },
    setElementFilter(value) {
        set({currentElementFilter: value});
    },
    setNameFilter(value) {
        set({currentNameFilter: value})
    },
}))