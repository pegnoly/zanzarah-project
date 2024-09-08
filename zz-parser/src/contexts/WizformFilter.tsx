import { createContext, PropsWithChildren, useContext, useState } from "react"

export type WizformFilter = {
    name: string,
    element: number
}

export type WizformFilterType = {
    state: WizformFilter,
    setState: (state: WizformFilter) => void
}

export const WizformFilterContext = createContext<WizformFilterType | undefined>(undefined);

const WizformFilterProvider = ({children} : PropsWithChildren<{}>) => {
    const [state, setState] = useState<WizformFilterType['state']>({name: "", element: -1});

    return (
        <WizformFilterContext.Provider value={{state, setState}}>
            {children}
        </WizformFilterContext.Provider>
    )
}

export const useWizformFilterContext = () => {
    const context = useContext(WizformFilterContext);
    return context;
}

export default WizformFilterProvider;