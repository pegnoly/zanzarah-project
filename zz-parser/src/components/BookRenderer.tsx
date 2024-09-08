import { useState } from "react";
import { Book } from "./BooksFacade";

export function BookRenderer() {
    const [name, setName] = useState<string>("");
    const [initialized, setInitialized] = useState<boolean>(false);
    const [downloadadble, setDownloadable] = useState<boolean>(false);

    function onBookCreated(book: Book) {

    }
}