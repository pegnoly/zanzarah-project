import { useEffect, useState } from "react";
import { MagicElement, Wizform } from "../types";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { createStyles } from "antd-style";
import { WizformFocused } from "./WizformFocused";
import { Route, Routes } from "react-router-dom";
import { WizformSelector } from "./WizformSelector";
import { invoke } from "@tauri-apps/api/core";

const wizformMainStyles = createStyles(({}) => ({
    main: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center'
    },
    selector: {
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center'
    },
    focused: {
        width: '60%',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center'
    }
}));

interface WizformsMainSchema {
    wizforms: Wizform[],
    elements: MagicElement[],
    onSingleWizformUpdate: (w: Wizform) => void,
    onMultipleWizformsUpdate: (wfs: Wizform[]) => void
}

export function WizformMain(schema: WizformsMainSchema) {

    const [wizformsToRender, setWizformsToRender] = useState<Wizform[]>([]);

    const wizformFilterContext = useWizformFilterContext();

    const styles = wizformMainStyles();

    // initially all wizforms must be rendered(until i implement storing of filters)
    useEffect(() => {
        if (schema.wizforms.length > 0) {
            setWizformsToRender(schema.wizforms
                .filter((w) => wizformFilterContext?.state.name == "" ? w : w.name.includes(wizformFilterContext?.state.name as string))
                .filter((w) => wizformFilterContext?.state.element == -1 ? w : w.element == wizformFilterContext?.state.element)
                .sort((w1, w2) => w1.number < w2.number ? -1 : 1)
            );
        }
    }, [schema.wizforms, wizformFilterContext?.state.name, wizformFilterContext?.state.element]);

    function onWizformEnabledUpdated(wizform: Wizform, enabled: boolean) {
        schema.onSingleWizformUpdate({
            ...wizform,
            enabled: enabled
        });
    }

    function onWizformElementUpdated(wizform: Wizform, element: number) {
        schema.onSingleWizformUpdate({
            ...wizform,
            element: element
        });
    }

    function onWizformNameUpdated(wizform: Wizform, name: string) {
        schema.onSingleWizformUpdate({
            ...wizform,
            name: name
        });
    }

    function onWizformDescUpdated(wizform: Wizform, desc: string) {
        schema.onSingleWizformUpdate({
            ...wizform,
            desc: desc
        });
    }

    function onWizformFiltersUpdated(wizform: Wizform, filters: number[]) {
        schema.onSingleWizformUpdate({
            ...wizform,
            filters: filters
        })
    }

    function onWizformSpawnsUpdated(wizform: Wizform, spawns: string[]) {
        schema.onSingleWizformUpdate({
            ...wizform,
            spawn_points: spawns
        })
    }

    async function onFilterDisabled(type: number) {
        const wizformsWithDisabledFilter = schema.wizforms.filter(w => w.filters.includes(type))
            .map(w => {
                return {
                    ...w,
                    filters: w.filters.filter(f => f != type)
                }
            });
        if (wizformsWithDisabledFilter.length == 0) {
            return
        }
        await invoke("update_wizforms", {wizforms: wizformsWithDisabledFilter});
        const updatedWizforms = schema.wizforms.map(w => {
            const checkWizform = wizformsWithDisabledFilter.find(wf => wf.id == w.id);
            if (checkWizform == undefined) {
                return w;
            }
            else {
                return {
                    ...w,
                    filters: checkWizform.filters
                }
            }
        });

        schema.onMultipleWizformsUpdate(updatedWizforms);
    }

    async function onSpawnPointRemoved(pointId: string) {
        const wizformsWithRemovedPoint = schema.wizforms
            .filter(w => w.spawn_points.includes(pointId))
            .map(w => {
                return {
                    ...w,
                    spawn_points: w.spawn_points.filter(s => s != pointId)
                }
            })
        if (wizformsWithRemovedPoint.length == 0) {
            return
        }
        await invoke("update_wizforms", {wizforms: wizformsWithRemovedPoint});
        const updatedWizforms = schema.wizforms.map(w => {
            const checkWizform = wizformsWithRemovedPoint.find(wf => wf.id == w.id);
            if (checkWizform == undefined) {
                return w;
            }
            else {
                return {
                    ...w,
                    spawn_points: checkWizform.spawn_points
                }
            }
        });

        schema.onMultipleWizformsUpdate(updatedWizforms);
    }

    return (
        <>
            <div className={styles.styles.main}>
                <WizformSelector 
                    elements={schema.elements} 
                    wizforms={wizformsToRender} 
                    filterDisabledCallback={onFilterDisabled}
                    spawnPointRemovedCallback={onSpawnPointRemoved}
                />
                <Routes>
                    <Route 
                        path="focus/:id" 
                        element={
                            <WizformFocused 
                                elements={schema.elements} 
                                wizforms={wizformsToRender}
                                elementUpdateCallback={onWizformElementUpdated}
                                enabledUpdateCallback={onWizformEnabledUpdated}
                                nameUpdateCallback={onWizformNameUpdated}
                                descUpdateCallback={onWizformDescUpdated}
                                filtersUpdateCallback={onWizformFiltersUpdated}
                                spawnsUpdateCallback={onWizformSpawnsUpdated}
                        />}/>
                </Routes>
            </div>
        </>
    )
}