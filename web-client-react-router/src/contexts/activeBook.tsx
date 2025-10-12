import { useElements, type WizformElement } from "@/queries/elements";
import Cookies from "js-cookie";
import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveCollection } from "@/queries/collections/activeCollectionQuery";

export interface ActiveBookContextType {
    id: string | undefined,
    elements: WizformElement [] | undefined,
    currentCollection: string | null,
    updateId: (newId: string) => void,
    updateCurrentCollection: (newCollection: string | null) => void
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
    const [collection, setCollection] = useState<string | null>(null);

    async function updateActiveBook(newId: string) {
        Cookies.set("zanzarah-project-current-book", newId, {expires: 10000000});
        setActiveBook(newId);
    }

    async function updateCollection(newCollection: string | null) {
        setCollection(newCollection);
    }

    return (
        <>
            <ActiveBookContext.Provider value={{
                id: activeBook, 
                elements: elements,
                currentCollection: collection,
                updateId: updateActiveBook,
                updateCurrentCollection: updateCollection
            }}>
                {children}
            </ActiveBookContext.Provider>
            {
                activeBook == undefined ? null : 
                <>
                    <ElementsLoader id={activeBook} onLoad={setElements}/>
                    <CollectionLoader id={activeBook} onLoad={setCollection}/>
                </>
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

function CollectionLoader({id, onLoad}: {id: string | undefined, onLoad: (value: string | null) => void}) {
    const auth = useAuth();

    if (auth?.userId == undefined || id == undefined) {
        return null;
    }

    const { data } = useActiveCollection(auth.userId, id);
    useEffect(() => {
        if (data != undefined) {
            onLoad(data);
        }
    }, [data]);

    return null;
}

function useActiveCollection(userId: string, bookId: string) {
    return useQuery({
        queryKey: ['active_collection', userId, bookId],
        queryFn: async() => {
            return fetchActiveCollection({userId: userId, bookId: bookId});
        }
    })
}

export const useActiveBook = (): ActiveBookContextType | undefined => {
    const context = use(ActiveBookContext);
    return context;
}

export default ActiveBookProvider;