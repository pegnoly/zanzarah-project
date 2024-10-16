import { useEffect, useState } from "react";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { AppState, useAppStateContext } from "../contexts/AppState";
import { invoke } from "@tauri-apps/api/core";
import { Book } from "./types";

export function BooksSelector() {

    const [books, setBooks] = useState<Book[]>([]);
    const appStateContext = useAppStateContext();

    useEffect(() => {
        console.log("App state is ", appStateContext?.state);
        if(appStateContext?.state.current_state == AppState.Ready) {
            invoke("load_app").then((v) => setBooks(v as Book[]));
        }
    }, [appStateContext?.state.current_state])

    console.log(books);

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5%'}}>
                <Typography.Text style={{fontSize: 20}}>Выбрать книгу</Typography.Text>
                <List>{books.map((b, index) => (
                    <List.Item key={index}>
                        <Link to={`/wizforms/${b.id}`}>
                            <Typography.Text style={{fontFamily: 'Shantell Sans', fontWeight: 'bold', fontSize: 15}}>{b.name}</Typography.Text>
                        </Link>
                    </List.Item>
                ))}</List>
            </div>
        </>
    )
}