import { Input, Menu, Select } from "antd"
import { MagicElement, WizformElementType } from "../types"

import { useShallow } from "zustand/shallow";
import { useBooksStore } from "../stores/Book";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";


export function WizformFilterMenu() {

    const [currentBook, elements, setElements, elementFilter, setElementFilter, nameFilter, setNameFilter] = useBooksStore(useShallow((state) => [
        state.currentId,
        state.elements,
        state.loadElements,
        state.currentElementFilter,
        state.setElementFilter,
        state.currentNameFilter,
        state.setNameFilter
    ]));

    useEffect(() => {
        if (currentBook != undefined) {
            loadElements()
        }
    }, [currentBook]);

    const loadElements = async () => {
        await invoke<MagicElement[] | null>("load_elements", {bookId: currentBook})
            .then((elements) => setElements(elements))
    }

    function handleNameFilterUpdate(filter: string) {
        setNameFilter(filter);
    }

    function handleElementSelection(filter: WizformElementType) {
        setElementFilter(filter);
    }

    return (
        <>
            <Menu mode="horizontal" 
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 'vw100',
                    // display: 'flex',
                    alignItems: 'center'
                }}
                items={[
                    {
                        type: "item",
                        key: "name_selector",
                        style: {width: "48%", padding: "2%"},
                        label: (
                            <Input 
                                style={{width: "100%"}}
                                onChange={(e) => handleNameFilterUpdate(e.currentTarget.value)}
                                defaultValue={nameFilter!}
                            />
                        )
                    },
                    {
                        type: "item",
                        key: "element_selector",
                        style: {width: "48%", padding: 1},
                        label: (
                            <Select 
                                onChange={(e) => handleElementSelection(e)} 
                                style={{width: "100%"}}
                                defaultValue={elementFilter}
                            >
                                <Select.Option
                                    value={WizformElementType.None} 
                                    key={-1}
                                >Все стихии</Select.Option> 
                                {elements!.map((e, i) => (
                                <Select.Option 
                                    value={e.element} 
                                    key={i}
                                >{e.name}</Select.Option>
                            ))}</Select>
                        )
                    }
                    // {
                    //     type: "item",
                    //     key: "custom_selector",
                    //     style: {width: "33%", padding: 1},
                    //     label: (
                    //         <Select 
                    //             onChange={handleCustomFilterSelection}
                    //             style={{width: "100%"}}
                    //             defaultValue={wizformFilterContext?.state.custom}
                    //         >
                    //             <Select.Option 
                    //                 value={-1} 
                    //                 key={-1}
                    //             >Без доп. фильтра</Select.Option> 
                    //             {schema.filters.filter(f => f.enabled).map((f, i) => (
                    //             <Select.Option key={i} value={f.filter_type}>{f.name}</Select.Option>
                    //         ))}</Select>
                    //     )
                    // }
                ]}>
            </Menu>
        </>
    )
}