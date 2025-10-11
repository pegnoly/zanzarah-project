import { useElements, type WizformElement } from "@/queries/elements";
import Cookies from "js-cookie";
import { createContext, use, useEffect, useState, type ReactNode } from "react";

export interface ActiveBookContextType {
    id: string | undefined,
    elements: WizformElement [] | undefined,
    updateId: (newId: string) => void
}

export const ActiveBookContext = createContext<ActiveBookContextType | undefined>(undefined);

const getActiveBook = () => {
    const existing = Cookies.get("zanzarah-project-current-book");
    if (existing == undefined) {
        Cookies.set("zanzarah-project-current-book", "5a5247c2-273b-41e9-8224-491e02f77d8d", {expires: 10000000});
        return "5a5247c2-273b-41e9-8224-491e02f77d8d";
    }
    return existing;
}

function ActiveBookProvider({children}: {children: ReactNode}) {
    const [activeBook, setActiveBook] = useState<string | undefined>(getActiveBook());
    const [elements, setElements] = useState<WizformElement[] | undefined>(undefined);

    async function updateActiveBook(newId: string) {
        Cookies.set("zanzarah-project-current-book", newId, {expires: 10000000});
        setActiveBook(newId);
    }

    return (
        <>
            <ActiveBookContext.Provider value={{id: activeBook, elements: elements, updateId: updateActiveBook}}>
                {children}
            </ActiveBookContext.Provider>
            {
                activeBook == undefined ? null : <ElementsLoader id={activeBook} onLoad={setElements}/>
            }
        </>
    )
}


function ElementsLoader({id, onLoad}: {id: string, onLoad: (data: WizformElement[]) => void}) {
    const { data } = useElements(id);
    
    useEffect(() => {
        if (data != undefined) {
            onLoad(data.elements);
        }
    }, [data])

    return null;
}

export const useActiveBook = (): ActiveBookContextType | undefined => {
    const context = use(ActiveBookContext);
    return context;
}

export default ActiveBookProvider;