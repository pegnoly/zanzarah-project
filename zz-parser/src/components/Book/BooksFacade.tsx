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
import { useBooksStore } from "../../stores/Book";
import { useShallow } from "zustand/shallow";

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

    const appStateContext = useAppStateContext();

    const [selectBook, loadBook, initializeBook] = useBooksStore(useShallow((state) => [state.select_current, state.load, state.initialize]));
    const [id, name, directory, initialized, downloadable] = useBooksStore(useShallow((state) => [state.id, state.name, state.directory, state.initialized, state.downloadadble]));

    useEffect(() => {
        if (appStateContext?.state == AppState.Ready) {
            selectBook();
        }
    }, [appStateContext?.state])

    useEffect(() => {
        if (id != undefined) {
            loadBook(id);
        }
    }, [id])
    
    const styles = booksFacadeStyles();

    /**
     * Response for book creation interaction  
     * Invokes loading of created book
     * @param id - id of created book
     */
    function onBookCreated(id: string) {
        loadBook(id)
    }

    /**
     * Scans files for current book
     */
    function performScan() {
        invoke("try_parse_texts", {directory: directory})
            .then(() => 
                invoke("try_parse_wizforms", {bookId: id, directory: directory})
                    .then(() => {
                        if (initialized == false) {
                            initializeBook(id!);
                        }
                    }))
    }

    return (
        <>
            <div className={styles.styles.header}>
                <Row>
                    <Col style={{display: "flex", alignItems: "center", flexDirection: "column"}} span={6}>
                        <Typography.Text style={{fontFamily: "fantasy"}}>Текущая книга</Typography.Text>
                        <Typography.Text>{name ? name : "Не загружено"}</Typography.Text>
                        <BookCreator callback={onBookCreated}/>
                    </Col>
                    <Col style={{display: "flex", alignItems: "center", flexDirection: "column"}} span={8}>
                        <Typography.Text style={{fontFamily: "fantasy"}}>Состояние файлов</Typography.Text>
                        <Typography.Text>{initialized ? "Файлы готовы" : "Файлы не готовы"}</Typography.Text>
                        <Button onClick={performScan}>Сканировать файлы игры</Button>
                    </Col>
                    <Col style={{display: "flex", alignItems: "center", flexDirection: "column"}} span={10}>
                        <Typography.Text style={{fontFamily: "fantasy"}}>Доступность книги</Typography.Text>
                        <Typography.Text>{downloadable ? "Книга доступна для загрузки" : "Книга недоступна для загрузки"}</Typography.Text>
                        <Button>Установить доступность загрузки</Button>
                    </Col>
                </Row>
            </div>
            <WizformFilterProvider>
                <SpawnPointsProvider>
                    <BookDataRenderer id={id!} initialized={initialized}/>
                </SpawnPointsProvider> 
            </WizformFilterProvider>
        </>
    )
}