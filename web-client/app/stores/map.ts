import { Location, LocationWizformEntry, SelectableWizform } from "@/utils/queries/map"
import { create } from "zustand"

type Data = {
    locations: Location [] | undefined,
    entriesData: Map<string, LocationWizformEntry[] | undefined> | undefined,
    selectablesData: Map<string, SelectableWizform[] | undefined> | undefined,
    currentLocation: string | undefined
}

type Action = {
    setLocations: (value: Location []) => void,
    setEntries: (value: Map<string, LocationWizformEntry [] | undefined>) => void,
    setSelectables: (value: Map<string, SelectableWizform [] | undefined>) => void,
    setCurrentLocation: (value: string | undefined) => void
}

const useMapStore = create<Data & Action>((set) => ({
    locations: undefined,
    entriesData: new Map(),
    selectablesData: new Map(),
    currentLocation: undefined,

    setLocations(value) {
        set({locations: value});
    },
    setEntries(value) {
        set({entriesData: value});
    },
    setSelectables(value) {
        set({selectablesData: value});
    },
    setCurrentLocation(value) {
        set({currentLocation: value});
    },
}));

export default useMapStore;