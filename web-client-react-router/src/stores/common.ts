import type { WizformElement } from "@/queries/elements";
import { create } from "zustand";

type Actions = {
    loadElements: (value: WizformElement[]) => void
}

type Store = {
    elements: WizformElement [] | undefined,
    actions: Actions
}

const store = create<Store>((set) => ({
    elements: undefined,
    actions: {
        loadElements(value) {
            set({elements: value})
        },
    }
}));

export namespace CommonStore {
    export const useElements = () => store(state => state.elements);
    export const useActions = () => store(state => state.actions);
}