import { useEffect, useState } from "react";
import { Book } from "./types";
import { invoke } from "@tauri-apps/api/core";
import booksStore from "./store";
import { UUID } from "crypto";
import BooksSelector from "./selector";
import CurrentBook from "./currentBook";
import { useShallow } from "zustand/shallow";

function BooksMain() {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentBookId, setCurrentBookId] = booksStore(useShallow((state) => [state.currentBookId, state.setCurrentBookId]));

    useEffect(() => {
        loadBooksInitial();
        loadCurrentBookInitial();
    }, []);

    const loadBooksInitial = async () => {
        await invoke<Book[]>("load_books")
            .then((values) => {
                setBooks(values);
            });
    }

    const loadCurrentBookInitial = async () => {
        await invoke<UUID>("load_current_book")
            .then((value) => setCurrentBookId(value));
    }

    return <div style={{width: '100%', height: '100%'}}>
        <div style={{width: '33%', height: '100%'}}>
            <CurrentBook book={books.find((b) => b.id == currentBookId)}/>
        </div>
        <BooksSelector books={books}/>
    </div>
}

export default BooksMain;