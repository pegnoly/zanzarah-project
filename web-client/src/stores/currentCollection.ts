import { create } from "zustand"

type Actions = {
    setCurrent: (value: string) => void
}

type Store = {
    current: string | null,
    actions: Actions
}

const store = create<Store>((set) => ({
    current: null,
    actions: {
        setCurrent(value) {
            set({current: value})
        },
    }
}));

export namespace CurrentCollectionStore {
    export const useCurrent = () => store(state => state.current);
    export const useActions = () => store(state => state.actions);
}