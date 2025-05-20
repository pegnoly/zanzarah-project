import { useShallow } from "zustand/shallow";
import WizformsList from "./list";
import useWizformsStore from "./store";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import { invoke } from "@tauri-apps/api/core";
import booksStore from "../../header/store";
import { Route, Routes } from "react-router-dom";
import WizformFocused, { WizformEditableModel } from "./focused";

export type WizformSimple = {
    id: UUID,
    name: string,
    icon64: string,
    enabled: boolean
}

function WizformsCore() {
    const [elementFilter, nameFilter] = useWizformsStore(useShallow((state) => [state.elementFilter, state.nameFilter]));
    const [wizforms, setWizforms] = useState<WizformSimple[]>([]);
    const currentBook = booksStore(state => state.currentBookId);

    useEffect(() => {
        if (currentBook) {
            loadWizforms();
        }
    }, [elementFilter, nameFilter, currentBook])

    const loadWizforms = async() => {
        await invoke<WizformSimple[]>("load_wizforms", {bookId: currentBook, element: elementFilter, name: nameFilter})
            .then((values) => setWizforms(values));
    }

    async function updateWizforms(value: WizformEditableModel) {
        let updatedWizforms = wizforms.map((w) => {
            if (w.id == value.id) {
                return {...w, enabled: value.enabled}
            } else {
                return w
            }
        });
        if (value.element != elementFilter) {
            updatedWizforms = updatedWizforms.filter(w => w.id != value.id);
        }
        setWizforms(updatedWizforms);
    }

    return <>
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
            <WizformsList models={wizforms}/>
            <Routes>
                <Route path="focused/:id" element={<WizformFocused updateCallback={updateWizforms}/>}/>
            </Routes>
        </div>
    </>
}

export default WizformsCore;