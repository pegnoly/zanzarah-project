import { createContext, PropsWithChildren, useContext, useState } from "react"
import { WizformElementType } from "../components/types"

export type WizformFilter = {
    name: string,
    element: WizformElementType,
    custom: number
}

export type WizformFilterType = {
    state: WizformFilter,
    setState: (state: WizformFilter) => void
}

export const WizformFilterContext = createContext<WizformFilterType | undefined>(undefined);

const WizformFilterProvider = ({children} : PropsWithChildren<{}>) => {
    
    const [state, setState] = useState<WizformFilterType['state']>({name: "", element: WizformElementType.None, custom: -1});

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