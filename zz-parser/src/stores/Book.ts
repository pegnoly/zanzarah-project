import { create } from "zustand"
import { Book } from "../components/types"
import { invoke } from "@tauri-apps/api/core";

type State = {
    possible_ids: string[]
}

type Action = {
    select_current: () => Promise<unknown>,
    load: (book_id: string) => void,
    initialize: (book_id: string) => void
}

export const useBooksStore = create<Book & State & Action>((set, get) => ({
    id: null,
    name: null,
    directory: null,
    initialized: false,
    downloadadble: false,

    possible_ids: [],

    async select_current() {
        await invoke("load_current_book_info").then((value) => set({id: value as string}))
    },

    async load(book_id) {
        await invoke("try_load_book", {id: book_id}).then((value) => {
            let book = value as Book;
            set({
                id: book.id,
                name: book.name,
                directory: book.directory,
                initialized: book.initialized,
                downloadadble: book.downloadadble
            })
        })
    },

    async initialize(book_id) {
        set({initialized: true});
        await invoke("initialize_book", {bookId: book_id});
    },
}));