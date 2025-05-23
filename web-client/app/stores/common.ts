import {create} from 'zustand'
import { ElementModel, WizformElementType } from '../graphql/graphql'
import { WizformElement } from '../utils/queries/elements'
import { WizformSimpleModel } from '../utils/queries/wizforms'

type Data = {
    wizformsDisabled: boolean,
    currentBook: string | null,
    currentElementFilter: WizformElementType,
    currentNameFilter: string | undefined,
    elements: WizformElement [] | undefined,
    wizforms: WizformSimpleModel [] | undefined,
    currentCollection: string | null
}

type Action = {
    setWizformsDisabled: (value: boolean) => void,
    setCurrentBook: (value: string) => void,
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string | undefined) => void,
    setElements: (value: WizformElement [] | undefined) => void,
    setWizforms: (value: WizformSimpleModel [] | undefined) => void,
    setCurrentCollection: (value: string) => void
}

export const useCommonStore = create<Data & Action>((set) => ({
    wizformsDisabled: false,
    currentBook: null,
    currentElementFilter: WizformElementType.Nature,
    currentNameFilter: undefined,
    elements: [],
    wizforms: [],
    currentCollection: null,

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
    setWizforms(value) {
        set({wizforms: value});
    },
    setCurrentCollection(value) {
        set({currentCollection: value});
    },
}))