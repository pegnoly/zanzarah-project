import { useElements, type WizformElement } from "@/queries/elements";
import Cookies from "js-cookie";
import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveCollection } from "@/queries/collections/activeCollectionQuery";
import { WizformElementType } from "@/graphql/graphql";

export interface ActiveBookContextType {
    id: string | undefined,
    currentNameFilter: string | undefined,
    currentElementFilter: WizformElementType | undefined,
    elements: WizformElement [] | undefined,
    currentCollection: string | null,
    updateId: (newId: string) => void,
    updateNameFilter: (newFilter: string) => void,
    updateElementFilter: (newFilter: WizformElementType) => void,
    updateCurrentCollection: (newCollection: string | null) => void
}

export const ActiveBookContext = createContext<ActiveBookContextType | undefined>(undefined);

const getActiveBook = () => {
    const existing = Cookies.get("zanzarah-project-current-book");
    if (existing == undefined) {
        Cookies.set("zanzarah-project-current-book", "78bd36dc-6ba2-4030-ac59-398076b73d93", {expires: 10000000});
        return "78bd36dc-6ba2-4030-ac59-398076b73d93";
    }
    return existing;
}

const getNameFilter = () => {
    const existing = Cookies.get("zanzarah-project-name-filter");
    if (existing == undefined) {
        Cookies.set("zanzarah-project-name-filter", "", {expires: 10000000});
        return "";
    }
    return existing;
}

const getElementFilter = () => {
    const existing = Cookies.get("zanzarah-project-element-filter");
    if (existing == undefined) {
        Cookies.set("zanzarah-project-element-filter", WizformElementType.Nature, {expires: 10000000});
        return WizformElementType.Nature;
    }
    return existing as WizformElementType;
}

function ActiveBookProvider({children}: {children: ReactNode}) {
    const [activeBook, setActiveBook] = useState<string | undefined>(getActiveBook());
    const [elements, setElements] = useState<WizformElement[] | undefined>(undefined);
    const [collection, setCollection] = useState<string | null>(null);
    const [nameFilter, setNameFilter] = useState<string>(getNameFilter());
    const [elementFilter, setElementFilter] = useState<WizformElementType>(getElementFilter());

    async function updateActiveBook(newId: string) {
        Cookies.set("zanzarah-project-current-book", newId, {expires: 10000000});
        setActiveBook(newId);
    }

    async function updateCollection(newCollection: string | null) {
        setCollection(newCollection);
    }

    async function updateNameFilter(newFilter: string) {
        Cookies.set("zanzarah-project-name-filter", newFilter, {expires: 10000000});
        setNameFilter(newFilter);
    }

    async function updateElementFilter(newFilter: WizformElementType) {
        Cookies.set("zanzarah-project-element-filter", newFilter, {expires: 10000000});
        setElementFilter(newFilter);
    }

    return (
        <>
            <ActiveBookContext.Provider value={{
                id: activeBook,
                currentNameFilter: nameFilter,
                currentElementFilter: elementFilter,
                elements: elements,
                currentCollection: collection,
                updateId: updateActiveBook,
                updateCurrentCollection: updateCollection,
                updateElementFilter: updateElementFilter,
                updateNameFilter: updateNameFilter
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