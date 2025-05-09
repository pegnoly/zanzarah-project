import { useEffect, useState } from "react";
import { List, Typography } from "antd";
import { Link } from "react-router-dom";
import { AppState, useAppStateContext } from "../contexts/AppState";
import { invoke } from "@tauri-apps/api/core";
import { Book } from "../types";

export function BooksSelector() {
    const [availableBooks, setAvailableBooks] = useState<Book[] | null>([]);
    const appStateContext = useAppStateContext();

    useEffect(() => {
        if(appStateContext?.state.current_state == AppState.Ready) {
            loadBooks()
        }
    }, [appStateContext?.state.current_state])

    const loadBooks = async () => {
        invoke<Book[] | null>("load_books")
            .then((books) => {
                setAvailableBooks(books)
            })
    }

    return (
        <>{
            availableBooks == null ? 
            <h1>No books</h1> :

            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5%'}}>
                <Typography.Text style={{fontSize: 20}}>Выбрать книгу</Typography.Text>
                <List>{availableBooks.map((book, index) => (
                    <List.Item key={index}>
                        <Link to={`/wizforms/${book.id}`}>
                            <Typography.Text style={{fontFamily: 'Shantell Sans', fontWeight: 'bold', fontSize: 15}}>{book.name}</Typography.Text>
                        </Link>
                    </List.Item>
                ))}</List>
            </div>
        }</>
    )
}