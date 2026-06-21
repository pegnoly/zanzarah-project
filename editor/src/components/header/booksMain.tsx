import { useEffect, useState } from "react";
import { Book } from "./types";
import { invoke } from "@tauri-apps/api/core";
import booksStore from "./store";
import { UUID } from "crypto";
import BooksSelector from "./selector";
import CurrentBook from "./currentBook";
import { useShallow } from "zustand/shallow";
import BookCreator from "./creator";

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
                console.log("Books: ", values);
                setBooks(values);
            });
    }

    const loadCurrentBookInitial = async () => {
        await invoke<UUID>("load_current_book")
            .then((value) => {
                console.log("Current book: ", value);
                setCurrentBookId(value);
            });
    }

    return <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row'}}>
        <div style={{width: '33%', height: '100%'}}>
            <CurrentBook book={books.find((b) => b.id == currentBookId)}/>
        </div>
        <BookCreator/>
        {/* <BooksSelector books={books}/> */}
    </div>
}

export default BooksMain;