import { createContext, PropsWithChildren, useContext, useState } from "react"

export enum AppState {
    NotReady,
    Ready
}

export type AppStateType = {
    state: AppState,
    setState: (state: AppState) => void
}

export const AppStateContext = createContext<AppStateType | undefined>(undefined);

const AppStateProvider = ({children} : PropsWithChildren<{}>) => {
    const [state, setState] = useState<AppStateType['state']>(AppState.NotReady);

    if (state == AppState.NotReady) {
        setState(AppState.Ready);
    }

    return (
        <AppStateContext.Provider value={{state, setState}}>
            {children}
        </AppStateContext.Provider>
    )
}

export const useAppStateContext = () => {
    const context = useContext(AppStateContext);
    return context;
}

export default AppStateProvider;