import { Filter, MagicElement, Wizform } from "../types";
import { CustomFiltersManager } from "./CustomFiltersManager";
import { SpawnPointsManager } from "./SpawnPointsManager";
import { WizformFilterer } from "./WizformFilterer";
import { WizformRenderer } from "./WizformRenderer";
import { invoke } from "@tauri-apps/api/core";

interface WizformSelectorSchema {
    elements: MagicElement[],
    wizforms: Wizform[],
    filterDisabledCallback: (type: number) => void,
    spawnPointRemovedCallback: (spawnId: string) => void
}

export function WizformSelector(schema: WizformSelectorSchema) {

    function handleCustomFilterUpdate(filter: Filter | null) {
        if (filter != null) {
            invoke("update_filter", {filter: filter});
            if (filter.enabled == false) {
                schema.filterDisabledCallback(filter.filter_type);
            } 
        }
    }

    async function handleSpawnPointRemove(spawn: string | null) {
        if (spawn != null) {
            await invoke("remove_spawn_point", {pointId: spawn});
            schema.spawnPointRemovedCallback(spawn);
        }
    }

    return (
        <div 
            style={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', alignContent: 'center'}}
        >
            {/* <SpawnPointsManager pointUpdateCallback={handleSpawnPointRemove}/>
            <CustomFiltersManager filterUpdateCallback={handleCustomFilterUpdate}/> */}
            <WizformFilterer elements={schema.elements}/>
            <WizformRenderer/>
        </div>
    )
}