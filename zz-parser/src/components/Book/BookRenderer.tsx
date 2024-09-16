import { Button, Segmented, Space } from "antd";
import { WizformRenderer } from "../Wizform/WizformRenderer";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { useEffect, useState } from "react";
import { Filter, MagicElement, Wizform } from "../types";
import { invoke } from "@tauri-apps/api/core";
import { ElementRenderer } from "../Element/ElementsRenderer";
import { WizformFilterer } from "../Wizform/WizformFilterer";
import { createStyles } from "antd-style";
import { WizformMain } from "../Wizform/WizformMain";


const bookRendererStyles = createStyles(({}) => ({
    main: {
        width: 'vw99',
        height: 'vh84'
    },
    content: {
        width: '40%',
        height: '100%'
    },
    focus: {
        width: '60%',
        height: '100%'
    }
}))

/**
 * Type of book content that can be rendered
 */
enum ContentType {
    Wizform,
    Element
}

interface BookRendererSchema {
    id: string,
    initialized: boolean
}

/**
 * Responsible to load renderable information and provide it to concrete components to display them  
 * Reacts on book loading/initialization  
 * Reacts on rendered content type change
 * @param schema - current book id & initialization info
 * @returns 
 */
export function BookDataRenderer(schema: BookRendererSchema) {

    const [contentType, setContentType] = useState<ContentType>(ContentType.Wizform);
    const [wizforms, setWizforms] = useState<Wizform[]>([]);
    const [elements, setElements] = useState<MagicElement[]>([]);

    const wizformFilterContext = useWizformFilterContext();

    const styles = bookRendererStyles();

    // component reacts to change of book id & initialization state and tries to load data
    useEffect(() => {
        tryLoadData(schema.initialized, schema.id);
    }, [schema.id, schema.initialized])

    // data can only be rendered if we have id of book to fetch data and book is initialized
    const tryLoadData = async (initialized: boolean, id: string) => {
        if (initialized && id != "") {
            await loadWizforms(id);
            await loadElements(id);
            await loadFilters(id);
        }
    }

    async function loadWizforms(bookId: string) {
        await invoke("load_wizforms", {bookId: bookId})
            .then((v) => setWizforms(v as Wizform[]));
    }

    async function loadElements(bookId: string) {
        await invoke("load_elements", {bookId: bookId})
            .then((v) => setElements(v as MagicElement[]));
    }

    async function loadFilters(boolId: string) {
        await invoke("load_filters", {bookId: boolId})
            .then((v) => {
                console.log("Got filters: {}", v);
                wizformFilterContext?.setState({
                ...wizformFilterContext.state,
                custom: v as Filter[]
            })});
    }

    function handleContentTypeChange(ct: ContentType) {
        setContentType(ct);
    }

    /**
     * Callback called when ElementRenderer updates some MagicElement
     * @param element - updated element
     */
    function onElementUpdated(element: MagicElement) {
        const updatedElements = elements.map((e) => {
            if (e.id != element.id) {
                return e;
            }
            else {
                return {
                    ...e,
                    name: element.name,
                    enabled: element.enabled
                }
            }
        });
        setElements(updatedElements);
        invoke("update_element", {element: element})
    }

    /**
     * Callback called when WizformRender updates some Wizform
     * @param wizform - updated wizform
     */
    function singleWizformUpdated(wizform: Wizform) {
        const updatedWizforms = wizforms.map((w) => {
            if (w.id != wizform.id) {
                return w;
            }
            else {
                return {
                    ...w,
                    name: wizform.name,
                    desc: wizform.desc,
                    element: wizform.element,
                    enabled: wizform.enabled,
                    filters: wizform.filters
                }
            }
        });
        setWizforms(updatedWizforms);
        invoke("update_wizform", {wizform: wizform});
    }

    function multipleWizformsUpdated(wizforms: Wizform[]) {
        setWizforms(wizforms);
    }

    return (
        <>
            <div className={styles.styles.main}>
                <Segmented 
                        onChange={handleContentTypeChange} 
                        options={[
                            {label: "Феи", value: ContentType.Wizform}, 
                            {label: "Стихии", value: ContentType.Element}
                        ]}/>
                {contentType == ContentType.Wizform ?
                    <WizformMain 
                        wizforms={wizforms} 
                        elements={elements} 
                        onSingleWizformUpdate={singleWizformUpdated}
                        onMultipleWizformsUpdate={multipleWizformsUpdated}
                    /> : 
                    <ElementRenderer elements={elements} updateCallback={onElementUpdated}/>
                }

            </div>
        </>
    )
}