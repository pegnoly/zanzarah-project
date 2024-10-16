import { create } from "zustand"
import { MagicElement } from "../components/types"
import { invoke } from "@tauri-apps/api/core"

type State = {
    elements: MagicElement[]
}

type Action = {
    load_elements: (id: string) => void
}

export const useBooksStore = create<State & Action>((set) => ({
    elements: [],
    async load_elements(id) {
        await invoke("load_elements", {bookId: id})
            .then((value) => set({elements: value as MagicElement[]}));
    },
}));