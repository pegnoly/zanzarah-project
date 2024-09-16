import { useEffect, useRef } from "react";
import { Filter, MagicElement, Wizform } from "../types";
import { CustomFiltersManager } from "./CustomFiltersManager";
import { SpawnPointsManager } from "./SpawnPointsManager";
import { WizformFilterer } from "./WizformFilterer";
import { WizformRenderer } from "./WizformRenderer";
import { invoke } from "@tauri-apps/api/core";

interface WizformSelectorSchema {
    elements: MagicElement[],
    wizforms: Wizform[],
    filterDisabledCallback: (type: number) => void
}

export function WizformSelector(schema: WizformSelectorSchema) {

    const selectorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        console.log("Ref: ", selectorRef.current?.offsetHeight);
    }, [selectorRef.current?.offsetHeight])

    function handleCustomFilterUpdate(filter: Filter | null) {
        if (filter != null) {
            invoke("update_filter", {filter: filter});
            if (filter.enabled == false) {
                schema.filterDisabledCallback(filter.filter_type);
            } 
        }
    }

    return (
        <div 
            style={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', alignContent: 'center'}}
            ref={selectorRef}
        >
            <SpawnPointsManager/>
            <CustomFiltersManager filterUpdateCallback={handleCustomFilterUpdate}/>
            <WizformFilterer elements={schema.elements}/>
            <WizformRenderer wizforms={schema.wizforms}/>
        </div>
    )
}