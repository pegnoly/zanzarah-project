import { Segmented, Space } from "antd";
import { WizformRenderer } from "../Wizform/WizformRenderer";
import WizformFilterProvider from "../../contexts/WizformFilter";
import { useEffect, useState } from "react";
import { MagicElement, Wizform } from "../types";
import { invoke } from "@tauri-apps/api/core";
import { ElementRenderer } from "../Element/ElementsRenderer";
import { WizformFilterer } from "../Wizform/WizformFilterer";

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

    // component reacts to change of book id & initialization state and tries to load data
    useEffect(() => {
        tryLoadData(schema.initialized, schema.id);
    }, [schema.id, schema.initialized])

    // data can only be rendered if we have id of book to fetch data and book is initialized
    const tryLoadData = async (initialized: boolean, id: string) => {
        if (initialized && id != "") {
            await loadWizforms(id);
            await loadElements(id);
        }
    }

    async function loadWizforms(bookId: string) {
        await invoke("load_wizforms", {bookId: bookId})
            .then((v) => setWizforms(v as Wizform[]));
    }

    async function loadElements(bookId: string) {
        await invoke("load_elements", {bookId: bookId})
            .then((v) => setElements(v as MagicElement[]))
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
    }

    /**
     * Callback called when WizformRender updates some Wizform
     * @param wizform - updated wizform
     */
    function onWizformUpdated(wizform: Wizform) {
        const updatedWizforms = wizforms.map((w) => {
            if (w.id != wizform.id) {
                return w;
            }
            else {
                return {
                    ...w,
                    name: wizform.name,
                    element: wizform.element
                }
            }
        });
        setWizforms(updatedWizforms);
    }

    return (
        <>
            <WizformFilterProvider>
                <Space>
                    <div style={{width : 400}}>
                        {contentType == ContentType.Wizform && <WizformFilterer elements={elements}/>}
                    </div>
                    <div style={{position : "relative", left: 200}}>
                        <Segmented 
                            onChange={handleContentTypeChange} 
                            options={[
                                {label: "Феи", value: ContentType.Wizform}, 
                                {label: "Стихии", value: ContentType.Element}
                            ]}></Segmented>
                    </div>
                </Space>
                {
                    contentType == ContentType.Wizform ? 
                    <WizformRenderer wizforms={wizforms} elements={elements} onUpdate={onWizformUpdated}/> :
                    <ElementRenderer elements={elements} updateCallback={onElementUpdated}/>
                }
            </WizformFilterProvider>
        </>
    )
}