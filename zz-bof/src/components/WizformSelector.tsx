import { Link, Route, Routes, useParams } from "react-router-dom";
import { WizformFocused } from "./WizformFocused";
import { useBooksStore } from "../stores/Book";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { WizformElementType } from "../types";
import { invoke } from "@tauri-apps/api/core";
import { List, Typography } from "antd";
import { WizformFilterMenu } from "./WizformFilterMenu";

type WizformListItem = {
    id: string,
    icon64: string,
    name: string
}

export function WizformSelector() {

    const { id } = useParams();
    const [currentBook, setCurrentBook, elementFilter, nameFilter] = useBooksStore(useShallow((state) => [
        state.currentId, state.setId, state.currentElementFilter, state.currentNameFilter
    ]));
    const [wizforms, setWizforms] = useState<WizformListItem[] | null>([]);

    useEffect(() => {
        if (id != undefined && id != currentBook) {
            setCurrentBook(id);
            loadWizforms();
        }
    }, [id]);

    useEffect(() => {
        loadWizforms();
    }, [elementFilter, nameFilter])

    const loadWizforms = async () => {
        await invoke<WizformListItem[] | null>("build_wizforms_list", {bookId: id, element: elementFilter, name: nameFilter})
            .then((wizforms) => {
                console.log(wizforms);
                setWizforms(wizforms);
            })
    }

    return (
        <>
            <Routes>
                <Route path="/" element={<WizformsList wizforms={wizforms}/>}/>
                <Route path="focus/:id/" element={<WizformFocused/>}/>
            </Routes>
        </>
    )
}

type WizformsListProps = {
    wizforms: WizformListItem[] | null
}

function WizformsList({wizforms} : WizformsListProps) {
    return (
        <>
            <WizformFilterMenu/>
            <div>{
                wizforms == null ?
                <h1>No wizforms</h1> :
                <List>
                    {wizforms.map((wizform, index) => (
                        <List.Item key={index}>
                            <Link style={{width: '100%'}} key={index} to={`focus/${wizform.id}`}>
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <img width={40} height={40} src={`data:image/bmp;base64,${wizform.icon64}`} style={{paddingLeft: '2%'}}></img>
                                    <Typography.Text style={{paddingLeft: '3%'}}>{wizform.name}</Typography.Text>
                                </div>
                            </Link>      
                        </List.Item>
                    ))}            
                </List>
            }</div>
        </>
    )
}