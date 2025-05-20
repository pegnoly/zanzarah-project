import {create} from 'zustand'
import { ElementModel, WizformElementType } from '../graphql/graphql'
import { WizformElement } from '../utils/queries/elements'

type Data = {
    wizformsDisabled: boolean,
    currentBook: string | null,
    currentElementFilter: WizformElementType,
    currentNameFilter: string | undefined,
    elements: WizformElement [] | undefined
}

type Action = {
    setWizformsDisabled: (value: boolean) => void,
    setCurrentBook: (value: string) => void,
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string) => void,
    setElements: (value: WizformElement [] | undefined) => void
}

export const useCommonStore = create<Data & Action>((set) => ({
    wizformsDisabled: false,
    currentBook: null,
    currentElementFilter: WizformElementType.Nature,
    currentNameFilter: undefined,
    elements: [],

    setWizformsDisabled(value) {
        set({wizformsDisabled: value});
    },
    setElementFilter(value) {
        set({currentElementFilter: value});
    },
    setNameFilter(value) {
        set({currentNameFilter: value});
    },
    setElements(value) {
        set({elements: value});
    },
    setCurrentBook(value) {
        set({currentBook: value});
    },
}))