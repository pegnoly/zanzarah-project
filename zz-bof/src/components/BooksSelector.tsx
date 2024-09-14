import { useEffect, useState } from "react";
import { List, Typography } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import { AppState, useAppStateContext } from "../contexts/AppState";
import { invoke } from "@tauri-apps/api/core";
import { WizformMain } from "./WizformMain";
import { Book } from "./types";

export function BooksSelector() {

    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBookId, setSelectedBookId] = useState<string>("");
    const [selectedBookName, setSelectedBookName] = useState<string>("");

    const appStateContext = useAppStateContext();

    useEffect(() => {
        console.log("App state is ", appStateContext?.state);
        if(appStateContext?.state.current_state == AppState.Ready) {
            invoke("load_books").then((v) => setBooks(v as Book[]));
        }
    }, [appStateContext?.state.current_state])

    console.log(books);

    return (
        <>
            <List>{books.map((b, index) => (
                <List.Item key={index}>
                    <Link to={`/wizforms/${b.id}`}>
                        <Typography.Text>{b.name}</Typography.Text>
                    </Link>
                </List.Item>
            ))}</List>
        </>
    )
}