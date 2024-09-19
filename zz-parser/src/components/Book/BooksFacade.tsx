import { useEffect, useState } from "react"
import { Button, Col, Row, Typography } from "antd";
import { invoke } from "@tauri-apps/api/core";
import { BookCreator } from "./BookCreator";
import { Book } from "../types";
import { AppState, useAppStateContext } from "../../contexts/AppState";
import { BookDataRenderer } from "./BookRenderer";
import WizformFilterProvider from "../../contexts/WizformFilter";
import { createStyles } from "antd-style";
import SpawnPointsProvider from "../../contexts/SpawnPoints";

const booksFacadeStyles = createStyles(({}) => ({
    header: {
        width: '99vw',
        height: '15vh'
    }
}))

/**
 * Renders current book's technical information  
 * Provides books creation/loading  
 * Provides params for book's content render
 * @returns TSX element 
 */
export function BooksFacade() {
    
    const [loaded, setLoaded] = useState<boolean>(false);
    const [bookId, setBookId] = useState<string>("");
    const [bookName, setBookName] = useState<string>("");
    const [bookDirectory, setBookDirectory] = useState<string>();
    const [bookInitializalized, setBookInitializalized] = useState<boolean>(false);
    const [bookDownloadable, setBookDownloadadble] = useState<boolean>(false);

    const appStateContext = useAppStateContext();

    useEffect(() => {
        if (appStateContext?.state == AppState.Ready) {
            invoke("load_current_book_info")
                .then((v1) => {
                    if (v1 as string != "") {
                        invoke("try_load_book", {id: v1 as string})
                            .then((v2) => onBookLoaded(v2 as Book))   
                    }
                })
        }
    }, [appStateContext?.state])

    const styles = booksFacadeStyles();

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
        setBookId(book.id);
        setBookName(book.name);
        setBookDirectory(book.directory);
        setBookInitializalized(book.initialized);
        setBookDownloadadble(book.downloadadble);
    }

    /**
     * Scans files for current book
     */
    function performScan() {
        invoke("try_parse_texts", {directory: bookDirectory})
            .then(() => 
                invoke("try_parse_wizforms", {bookId: bookId, directory: bookDirectory})
                    .then(() => {
                        if (bookInitializalized == false) {
                            initializeBook();
                        }
                    }))
    }

    /**
     * 
     */
    function initializeBook() {
        setBookInitializalized(true);
        invoke("initialize_book", {bookId: bookId});
    }

    return (
        <>
            <div className={styles.styles.header}>
                <Row>
                    <Col style={{display: "flex", alignItems: "center", flexDirection: "column"}} span={6}>
                        <Typography.Text style={{fontFamily: "fantasy"}}>Текущая книга</Typography.Text>
                        <Typography.Text>{loaded ? bookName : "Не загружено"}</Typography.Text>
                        <BookCreator callback={onBookCreated}/>
                    </Col>
                    <Col style={{display: "flex", alignItems: "center", flexDirection: "column"}} span={8}>
                        <Typography.Text style={{fontFamily: "fantasy"}}>Состояние файлов</Typography.Text>
                        <Typography.Text>{bookInitializalized ? "Файлы готовы" : "Файлы не готовы"}</Typography.Text>
                        <Button onClick={performScan}>Сканировать файлы игры</Button>
                    </Col>
                    <Col style={{display: "flex", alignItems: "center", flexDirection: "column"}} span={10}>
                        <Typography.Text style={{fontFamily: "fantasy"}}>Доступность книги</Typography.Text>
                        <Typography.Text>{bookDownloadable ? "Книга доступна для загрузки" : "Книга недоступна для загрузки"}</Typography.Text>
                        <Button onClick={() => invoke("upload_book", {bookId: bookId})}>Установить доступность загрузки</Button>
                    </Col>
                </Row>
            </div>
            <WizformFilterProvider>
                <SpawnPointsProvider>
                    <BookDataRenderer id={bookId} initialized={bookInitializalized}/>
                </SpawnPointsProvider> 
            </WizformFilterProvider>
        </>
    )
}