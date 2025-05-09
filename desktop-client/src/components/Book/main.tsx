import { useEffect, useState } from "react";
import { Book } from "./types";
import { createStyles } from "antd-style";
import { invoke } from "@tauri-apps/api/core";
import booksStore from "./store";
import { UUID } from "crypto";
import BooksSelector from "./selector";
import CurrentBook from "./current";
import { useShallow } from "zustand/shallow";

const booksMainStyles = createStyles(({}) => ({
    header: {
        width: '99vw',
        height: '15vh'
    }
}))


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

    const styles = booksMainStyles();

    return <div className={styles.styles.header}>
        <CurrentBook book={books.find((b) => b.id == currentBookId)}/>
        <BooksSelector books={books}/>
    </div>
}

export default BooksMain;