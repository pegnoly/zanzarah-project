import { useEffect } from 'react';
import ContentMain from '../content/contentMain';
import useElementsStore from '../content/elements/store';
import classes from './styles.module.css';
import { invoke } from '@tauri-apps/api/core';
import booksStore from '../header/store';
import { ElementModel } from '../content/elements/types';

function Body() {
    const setElements = useElementsStore(state => state.setElements);
    const currentBook = booksStore(state => state.currentBookId);

    useEffect(() => {
        if (currentBook != undefined) {
            loadElements();
        }
    }, [currentBook]);

    const loadElements = async() => {
        await invoke<ElementModel[]>("load_elements", {bookId: currentBook})
            .then((values) => setElements(values));
    }

    return <div className={classes.body}>
        <div style={{width: '100%', height: '100%'}}>
            <ContentMain/>
        </div>
    </div>
}

export default Body;