import { createContext, PropsWithChildren, useContext, useState } from "react"

export enum AppState {
    NotReady,
    Ready
}

export type AppTypeSchema = {
    current_state: AppState,
    current_book: string
}

export type AppStateType = {
    state: AppTypeSchema,
    setState: (state: AppTypeSchema) => void
}

export const AppStateContext = createContext<AppStateType | undefined>(undefined);

const AppStateProvider = ({children} : PropsWithChildren<{}>) => {
    const [state, setState] = useState<AppStateType['state']>({
        current_state: AppState.NotReady,
        current_book: ""
    });

    if (state.current_state == AppState.NotReady) {
        setState({
            ...state,
            current_state: AppState.Ready
        });
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