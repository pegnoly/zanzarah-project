import { create } from "zustand"
import { MagicElement, WizformElementType } from "../types"
import { invoke } from "@tauri-apps/api/core"

type State = {
    currentId: string | undefined,
    currentElementFilter: WizformElementType,
    currentNameFilter: string | null,
    elements: MagicElement[] | null
}

type Action = {
    setId: (id: string) => void,
    setElementFilter: (element: WizformElementType) => void,
    setNameFilter: (name: string | null) => void,  
    loadElements: (elements: MagicElement[] | null) => void
}

export const useBooksStore = create<State & Action>((set) => ({
    currentId: undefined,
    currentElementFilter: WizformElementType.None,
    currentNameFilter: null,
    elements: [],
    setId(id) {
        set({currentId: id})
    },
    setElementFilter(element) {
        set({currentElementFilter: element})
    },
    setNameFilter(name) {
        set({currentNameFilter: name})
    },
    async loadElements(elements) {
        set({elements: elements})
    },
}));