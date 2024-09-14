import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { useAppStateContext } from "../contexts/AppState";
import { WizformFocused } from "./WizformFocused";
import { invoke } from "@tauri-apps/api/core";
import { WizformSelector } from "./WizformSelector";
import { Filter, MagicElement, Wizform } from "./types";
import WizformFilterProvider from "../contexts/WizformFilter";

export function WizformMain() {

    const [wizforms, setWizforms] = useState<Wizform[]>([]);
    const [elements, setElements] = useState<MagicElement[]>([]);
    const [filters, setFilters] = useState<Filter[]>([]);
    
    const { id } = useParams();

    const appStateContext = useAppStateContext();

    useEffect(() => {
        if (id != undefined) {
            loadBookData(id);
        }
    }, [id])

    const loadBookData = async (id: string) => {
        if (id != "") {
            await loadWizforms(id);
            await loadElements(id);
            await loadFilters(id);
        }
    }

    async function loadWizforms(id: string) {
        await invoke("load_wizforms", {bookId: id}).then((v) => setWizforms(v as Wizform[])); 
    }

    async function loadElements(id: string) {
        await invoke("load_elements", {bookId: id}).then((v) => setElements(v as MagicElement[])); 
    }

    async function loadFilters(id: string) {
        await invoke("load_filters", {bookId: id}).then((v) => setFilters(v as Filter[]));  
    }

    console.log("test: ", wizforms[0]);

    return (
        <>
            <WizformFilterProvider>
                <Routes>
                    <Route path="/*" element={<WizformSelector wizforms={wizforms} elements={elements} filters={filters}/>}/>
                    <Route path="focus/:id/" element={<WizformFocused wizforms={wizforms}/>}/>
                </Routes>
            </WizformFilterProvider>
        </>
    )
}