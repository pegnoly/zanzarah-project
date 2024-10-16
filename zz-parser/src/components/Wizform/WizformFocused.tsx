import { useParams } from "react-router-dom";
import { MagicElement, Wizform, WizformElementType } from "../types";
import { useEffect, useState } from "react";
import { Button, Checkbox, Col, Row, Select, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
// import { createStyles } from "antd-style";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { useSpawnPointsContext } from "../../contexts/SpawnPoints";
import { invoke } from "@tauri-apps/api/core";

// const wizformFocusedStyles = createStyles(({}) => ({
//     container: {
//         width: '60%', 
//         flexDirection: 'column', 
//         paddingLeft: 20
//     },
//     main_data: {
//         width: '100%',
//         height: 'vh20'
//     },
//     inf_scroller: {
//         width: '100%',
//         height: 'vh30',
//         overflowY: 'scroll'
//     }
// }))

interface WizformFocusedSchema {
    wizforms: Wizform[],
    elements: MagicElement[]
    /**
     * Callback called when user changes wizform element
     * @param w - wizform that was updated
     * @param element - new element of this wizform
     * @returns 
     */
    elementUpdateCallback: (w: Wizform, element: number) => void,
    /**
     * Callback called when user sets wizform enabled or disabled for book
     * @param w - wizform that was updated
     * @param enabled - new state of this wizform enable
     * @returns 
     */
    enabledUpdateCallback: (w: Wizform, enabled: boolean) => void,
    /**
     * Callback called when user changes wizform name
     * @param w - wizform that was updated
     * @param name - new name of this wizform
     * @returns 
     */
    nameUpdateCallback: (w: Wizform, name: string) => void,

    descUpdateCallback: (w: Wizform, desc: string) => void,

    filtersUpdateCallback: (w: Wizform, filters: number[]) => void,

    spawnsUpdateCallback: (w: Wizform, spawns: string[]) => void
}

export function WizformFocused(schema: WizformFocusedSchema) {

    const [wizform, setWizform] = useState<Wizform | undefined>(undefined);

    const [elementSelectionEnabled, setElementSelectionEnabled] = useState<boolean>(false);

    const [currentElement, setCurrentElement] = useState<number | undefined>(undefined);
    const [enabledForBook, setEnabledForBook] = useState<boolean | undefined>(undefined);
    const [name, setName] = useState<string | undefined>(undefined);
    const [desc, setDesc] = useState<string | undefined>(undefined);
    // const [filters, setFilters] = useState<number[]>([]);
    // const [spawns, setSpawns] = useState<string[]>([]);

    const wizformFilterContext = useWizformFilterContext();

    const {id} = useParams();

    // const styles = wizformFocusedStyles();

    const spawnPointsContext = useSpawnPointsContext();

    useEffect(() => {
        if (id != undefined) {
            invoke("load_wizform", {id: id}).then((value) => {
                let wizform = value as Wizform;
                console.log("Wizform focused: ", wizform);
                setCurrentElement(wizform?.element);
                setEnabledForBook(wizform?.enabled);
                setName(wizform?.name);
                setDesc(wizform?.desc);
            })
            // setWizform(focusedWizform);
            // setCurrentElement(focusedWizform?.element);
            // setEnabledForBook(focusedWizform?.enabled);
            // setName(focusedWizform?.name);
            // setDesc(focusedWizform?.desc);
            // setFilters(focusedWizform?.filters as number[])
            // setSpawns(focusedWizform?.spawn_points as string[]);
        }
    }, [id])

    async function handleEnableUpdate(enabled: boolean) {
        await invoke("update_wizform_visibility", {id: id, enabled: enabled});
        setEnabledForBook(enabled);
        //schema.enabledUpdateCallback(wizform!, enabled); 
    }

    function handleNameUpdate(newName: string) {
        setName(newName);
        //schema.nameUpdateCallback(wizform!, newName);
    }

    function handleDescUpdate(newDesc: string) {
        setDesc(newDesc);
        //schema.descUpdateCallback(wizform!, newDesc);
    }

    async function handleElementUpdate(element: number) {
        setElementSelectionEnabled(false);
        setCurrentElement(element);
        console.log("New element selected: ", element);
        await invoke("update_wizform_element", {id: id, element: element});
        //schema.elementUpdateCallback(wizform!, element); 
    }

    // function handleCustomFilterSelection(newFilters: number[]) {
    //     setFilters(newFilters);
    //     schema.filtersUpdateCallback(wizform!, newFilters);
    // }

    // function handleSpawnPointSelection(newPoints: string[]) {
    //     setSpawns(newPoints);
    //     schema.spawnsUpdateCallback(wizform!, newPoints);
    // }

    return (
        <> { id != undefined &&
            <div style={{width: '60%', display: 'flex', flexDirection: 'column', paddingLeft: 20}}>

                <Checkbox 
                    checked={enabledForBook}
                    onChange={(e) => handleEnableUpdate(e.target.checked)}
                >Отображать в мобильном приложении</Checkbox>
                
                <Typography.Text 
                    style={{fontFamily: 'monospace', fontSize: 17, textAlign: 'center', paddingBottom: 5}}
                >Основные параметры</Typography.Text>

                <Row>
                    <Col style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}  span={12}>
                        <Typography.Text style={{fontFamily: 'cursive', fontSize: 14, paddingRight: 15}}>Имя:</Typography.Text>
                        <Typography.Text style={{fontSize: 14, width: '70%', textAlign: 'center'}} editable={{
                            onChange: (newText) => {handleNameUpdate(newText)}
                        }}>{name}</Typography.Text>
                    </Col>
                    <Col style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}  span={12}>
                            <Typography.Text style={{fontFamily: 'cursive'}}>Стихия:</Typography.Text>
                            <Select
                                style={{width: '50%', paddingLeft: 15}}
                                disabled={!elementSelectionEnabled} 
                                defaultValue={currentElement}
                                value={currentElement}
                                onChange={(e) => handleElementUpdate(e)}
                            >
                            {schema.elements.filter((e) => e.enabled).map((e, index) => (
                                <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                            ))}</Select>
                            <Button
                                type="link"
                                style={{
                                    color: elementSelectionEnabled ? "red" : "blue"
                                }}
                                shape="default"
                                icon={<EditOutlined/>}
                                onClick={() => setElementSelectionEnabled(!elementSelectionEnabled)}
                            />
                    </Col>
                </Row>

                <Typography.Text 
                    style={{fontFamily: 'monospace', fontSize: 17, textAlign: 'center', paddingBottom: 5}}
                >Описание</Typography.Text>

                <Typography.Text editable={{
                        onChange: (newText) => {handleDescUpdate(newText)}
                    }}>{desc}</Typography.Text>

                {/* <Typography.Text 
                    style={{fontFamily: 'monospace', fontSize: 17, textAlign: 'center', paddingBottom: 5, paddingTop: 5}}
                >Дополнительные параметры</Typography.Text>

                <Row>
                    <Col style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} span={12}>
                    <Typography.Text 
                        style={{
                            fontFamily: 'cursive', 
                            fontSize: 16, 
                            textAlign: 'center', paddingBottom: 5
                        }}>Места обитания феи</Typography.Text>
                        <div style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Select
                                value={spawns}
                                mode="multiple"
                                onChange={handleSpawnPointSelection}
                                style={{
                                    width: '90%',
                                    paddingLeft: 30,
                                    paddingRight: 5
                                }}
                            >{
                                spawnPointsContext?.state.points.map((p, i) => (
                                    <Select.Option key={i} value={p.id}>{p.name}</Select.Option>
                                ))
                            }</Select>
                        </div>
                    </Col>
                    <Col style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} span={12}>
                    <Typography.Text 
                        style={{
                            fontFamily: 'cursive', 
                            fontSize: 16, 
                            textAlign: 'center', paddingBottom: 5
                        }}>Особые фильтры фей</Typography.Text>
                        <div style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                            <Select
                                value={filters}
                                mode="multiple"
                                onChange={handleCustomFilterSelection}
                                style={{
                                    width: '90%',
                                    paddingLeft: 30,
                                    paddingRight: 5
                                }}
                            >{
                                wizformFilterContext?.state.custom.filter(f => f.enabled).map((f, i) => (
                                    <Select.Option key={i} value={f.filter_type}>{f.name}</Select.Option>
                                ))
                            }</Select>
                        </div>
                    </Col>
                </Row> */}
            </div>
            }
        </>
    )
}