import { createContext, PropsWithChildren, useContext, useState } from "react"
import { SpawnPoint } from "../components/types"

export type SpawnPoints = {
    book_id: string,
    points: SpawnPoint[]
}

export type SpawnPointsType = {
    state: SpawnPoints,
    setState: (state: SpawnPoints) => void
}

export const SpawnPointsContext = createContext<SpawnPointsType | undefined>(undefined);

const SpawnPointsProvider = ({children} : PropsWithChildren<{}>) => {
    
    const [state, setState] = useState<SpawnPointsType['state']>({book_id: "", points: []});

    return (
        <SpawnPointsContext.Provider value={{state, setState}}>
            {children}
        </SpawnPointsContext.Provider>
    )
}

export const useSpawnPointsContext = () => {
    const context = useContext(SpawnPointsContext);
    return context;
}

export default SpawnPointsProvider;