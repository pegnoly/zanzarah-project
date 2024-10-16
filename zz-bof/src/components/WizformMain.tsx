import { useEffect } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import { WizformFocused } from "./WizformFocused";
import { WizformSelector } from "./WizformSelector";
import WizformFilterProvider from "../contexts/WizformFilter";
import { useWizformStore } from "../stores/Wizform";
import { useBooksStore } from "../stores/Book";

export function WizformMain() {

    // const [wizforms, setWizforms] = useState<Wizform[]>([]);
    // const [elements, setElements] = useState<MagicElement[]>([]);
    // const [filters, setFilters] = useState<Filter[]>([]);
    
    const loadWizforms = useWizformStore((state) => state.load);
    const loadElements = useBooksStore((state) => state.load_elements);

    const { id } = useParams();

    useEffect(() => {
        if (id != undefined) {
            loadBookData(id);
        }
    }, [id])

    const loadBookData = async (id: string) => {
        if (id != "") {
            loadWizforms(id);
            loadElements(id);
            //await loadElements(id);
            //await loadFilters(id);
        }
    }

    // async function loadWizforms(id: string) {
    //     await invoke("load_wizforms", {bookId: id}).then((v) => setWizforms(v as Wizform[])); 
    // }

    // async function loadElements(id: string) {
    //     await invoke("load_elements", {bookId: id}).then((v) => setElements(v as MagicElement[])); 
    // }

    // async function loadFilters(id: string) {
    //     await invoke("load_filters", {bookId: id}).then((v) => setFilters(v as Filter[]));  
    // }

    return (
        <>
            <WizformFilterProvider>
                <Routes>
                    <Route path="/*" element={<WizformSelector/>}/>
                    <Route path="focus/:id/" element={<WizformFocused/>}/>
                </Routes>
            </WizformFilterProvider>
        </>
    )
}