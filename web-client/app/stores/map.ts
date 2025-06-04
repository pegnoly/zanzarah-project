import { Location } from "@/utils/queries/map"
import { create } from "zustand"

type Data = {
    locations: Location [] | undefined
}

type Action = {
    setLocations: (value: Location[]) => void
}

const useMapStore = create<Data & Action>((set) => ({
    locations: undefined,

    setLocations(value) {
        set({locations: value});
    },
}));

export default useMapStore;