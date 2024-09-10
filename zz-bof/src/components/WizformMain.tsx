import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import { useAppStateContext } from "../contexts/AppState";
import { List, Space, Typography } from "antd";
import { WizformFocused } from "./WizformFocused";
import { invoke } from "@tauri-apps/api/core";
import { WizformSelector } from "./WizformSelector";

export function WizformMain() {
    const [wizforms, setWizforms] = useState<Wizform[]>([]);
    
    const { id } = useParams();

    const appStateContext = useAppStateContext();

    useEffect(() => {
        console.log("book id is ", id);
        if (id != undefined) {
            if (appStateContext?.state.current_book != id) {
                appStateContext?.setState({
                    ...appStateContext.state,
                    current_book: id
                });
                invoke("test_file_save", {bookId: id}).then((v) => setWizforms(v as Wizform[]));
            }
        }
    }, [id])

    return (
        <>
            <Routes>
                <Route path="/*" element={<WizformSelector wizforms={wizforms}/>}/>
                <Route path="focus/:id/" element={<WizformFocused wizforms={wizforms}/>}/>
            </Routes>
        </>
    )
}