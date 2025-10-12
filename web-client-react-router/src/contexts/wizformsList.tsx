import type { WizformSimpleModel } from "@/queries/wizforms/types";
import { createContext, use, useState, type ReactNode } from "react";

export interface WizformsListContextType {
    items: WizformSimpleModel[],
    addItemToCollection: (id: string, inCollectionId: string) => void,
    removeItemFromCollection: (id: string) => void 
}

export const WizformsListContext = createContext<WizformsListContextType | undefined>(undefined);

function WizformsListProvider({initialItems, children}: {initialItems: WizformSimpleModel[], children: ReactNode}) {
    const [items, setItems] = useState<WizformSimpleModel[]>(initialItems);

    async function addItemToCollection(id: string, inCollectionId: string) {
        setItems(items.map(i => {
            if (i.id == id) {
                i.inCollectionId = inCollectionId
            }
            return i;
        }));
    }

    async function removeItemFromCollection(id: string) {
        setItems(items.map(i => {
            if (i.id == id) {
                i.inCollectionId = null
            }
            return i;
        }));
    }

    return (
        <>
            <WizformsListContext.Provider value={{
                items: items, 
                addItemToCollection: addItemToCollection, 
                removeItemFromCollection: removeItemFromCollection
            }}>
                {children}
            </WizformsListContext.Provider>
        </>
    )
}

export const useWizformsList = (): WizformsListContextType | undefined => {
    const context = use(WizformsListContext);
    return context;
}

export default WizformsListProvider;