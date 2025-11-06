import type { WizformSimpleModel } from "@/queries/wizforms/types";
import { createContext, use, useState, type ReactNode } from "react";

export interface WizformsListContextType {
    items: WizformSimpleModel[],
    updateItems: (data: WizformSimpleModel[]) => void,
    addItemToCollection: (id: string, inCollectionId: string) => void,
    removeItemFromCollection: (id: string) => void 
}

export const WizformsListContext = createContext<WizformsListContextType | undefined>(undefined);

function WizformsListProvider({children}: {children: ReactNode}) {
    const [items, setItems] = useState<WizformSimpleModel[]>([]);

    async function updateItems(data: WizformSimpleModel[]) {
        setItems(data);
    }

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
                updateItems: updateItems,
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