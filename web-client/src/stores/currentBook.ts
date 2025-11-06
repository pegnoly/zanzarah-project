import type { BookFullModel } from "@/queries/books"
import { create } from "zustand"

type Actions = {
    loadBook: (model: BookFullModel) => void
}

type Store = {
    name: string | undefined,
    version: string | undefined,
    wizformsCount: number | undefined,
    activeWizformsCount: number | undefined,

    actions: Actions
}

const store = create<Store>((set) => ({
    name: undefined,
    version: undefined,
    wizformsCount: undefined,
    activeWizformsCount: undefined,

    actions: {
        loadBook(model) {
            set({
                name: model.name,
                version: model.version,
                wizformsCount: model.wizformsCount,
                activeWizformsCount: model.activeWizformsCount
            })
        },
    }
}));

export namespace CurrentBookStore {
    export const useName = () => store(state => state.name);
    export const useVersion = () => store(state => state.version);
    export const useWizformsCount = () => store(state => state.wizformsCount);
    export const useActiveWizformsCount = () => store(state => state.activeWizformsCount);
    export const useActions = () => store(state => state.actions);
}