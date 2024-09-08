import { useEffect, useState } from "react"
import { Button, Space, Typography } from "antd";
import { invoke } from "@tauri-apps/api/core";
import { BookCreator } from "./BookCreator";
import { WizformRenderer } from "./WizformRenderer";
import { ElementRenderer, MagicElement } from "./ElementsRenderer";
import { AppState } from "../App";

/**
 * Represents a book instance modder can edit.
 * @param id - id of a book in the database
 * @param name - displayable book name
 * @param directory - directory of game this book build upon
 * @param initialized - book becomes initialized only after correct parsing of game files
 * @param downloadadble - indicates that book can or can't be downloaded with mobile app                                                                                                                        
 */
export type Book = {
    id: string,
    name: string,
    directory: string,
    initialized: boolean,
    downloadadble: boolean
}      

export type Wizform = {
    id: string,
    name: string,
    element: number
}

const {Text, Title} = Typography;

/**
 * Renders current book's technical information  
 * Provides books creation/loading  
 * Provides params for book's content render
 * @returns TSX element 
 */
export function BooksFacade(
    // {state}: 
    // {state: AppState}
) {
    
    const [state, setState] = useState<AppState>(AppState.NotReady);

    const [loaded, setLoaded] = useState<boolean>(false);
    const [bookId, setBookId] = useState<string>("");
    const [bookName, setBookName] = useState<string>("");
    const [bookDirectory, setBookDirectory] = useState<string>();
    const [bookInitializalized, setBookInitializalized] = useState<boolean>(false);
    const [bookDownloadable, setBookDownloadadble] = useState<boolean>(false);

    const [wizforms, setWizforms] = useState<Wizform[]>([]);
    const [elements, setElements] = useState<MagicElement[]>([]);

    useEffect(() => {
        console.log("Well, app state is ", state);
        if (state == AppState.NotReady) {
            setState(AppState.Ready);
            console.log("App is not ready...")
            invoke("load_current_book_info")
                .then((v1) => {
                    console.log("What we got from config: ", v1);
                    if (v1 as string != "") {
                        invoke("try_load_book", {id: v1 as string})
                            .then((v2) => onBookLoaded(v2 as Book))   
                    }
                })
        }
    }, [state])

    /**
     * Response for book creation interaction  
     * Invokes loading of created book
     * @param id - id of created book
     */
    function onBookCreated(id: string) {
        setBookId(id);
        invoke("try_load_book", {id: id})
            .then((v) => onBookLoaded(v as Book));
    }

    /**
     * Response for book loading interaction  
     * @param book - loaded book
     */
    async function onBookLoaded(book: Book) {
        setLoaded(true);
        setBookName(book.name);
        setBookDirectory(book.directory);
        setBookInitializalized(book.initialized);
        setBookDownloadadble(book.downloadadble);

        if (book.initialized) {
            await invoke("load_wizforms", {bookId: book.id})
                .then((v) => setWizforms(v as Wizform[]));
            await invoke("load_elements", {bookId: book.id})
                .then((v) => setElements(v as MagicElement[]))
        }
    }

    function performScan() {
        invoke("try_parse_texts", {directory: bookDirectory})
            .then(() => 
                invoke("try_parse_wizforms", {bookId: bookId, directory: bookDirectory})
                    .then((v) => {
                        setWizforms(v as Wizform[]);
                        if (bookInitializalized == false) {
                            initializeBook();
                        }
                    }))
    }

    function initializeBook() {
        setBookInitializalized(true);
        invoke("initialize_book", {bookId: bookId});
    }

    return (
        <>
            <Space direction="vertical">
                <Space direction="horizontal">
                    <Text style={{fontFamily: "fantasy"}}>Текущая книга</Text>
                    <Text>{loaded ? bookName : "Не загружено"}</Text>
                    <BookCreator callback={onBookCreated}/>
                    <Button>Загрузить книгу</Button>
                </Space>
                <Space direction="horizontal">
                    <Text style={{fontFamily: "fantasy"}}>Состояние файлов</Text>
                    <Text>{bookInitializalized ? "Файлы готовы" : "Файлы не готовы"}</Text>
                    <Button onClick={performScan}>Сканировать файлы игры</Button>
                </Space>
                <Space direction="horizontal">
                    <Text style={{fontFamily: "fantasy"}}>Доступность книги</Text>
                    <Text>{bookDownloadable ? "Книга доступна для загрузки" : "Книга недоступна для загрузки"}</Text>
                    <Button>Установить доступность загрузки</Button>
                </Space>
                {bookInitializalized && <WizformRenderer wizforms={wizforms}/>}
                {bookInitializalized && <ElementRenderer elements={elements}/>}
            </Space>
        </>
    )
}