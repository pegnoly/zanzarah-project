import { useParams } from "react-router-dom";
import { MagicElement, Wizform } from "../types";
import { useEffect, useState } from "react";
import { Button, Checkbox, Col, Row, Select, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";


interface WizformFocusedSchema {
    wizforms: Wizform[],
    elements: MagicElement[],
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

    spawnsUpdateCallback: (w: Wizform, spawns: number[]) => void
}

export function WizformFocused(schema: WizformFocusedSchema) {

    const [wizform, setWizform] = useState<Wizform | undefined>(undefined);

    const [elementSelectionEnabled, setElementSelectionEnabled] = useState<boolean>(false);
    const [currentElement, setCurrentElement] = useState<number | undefined>(undefined);
    const [enabledForBook, setEnabledForBook] = useState<boolean | undefined>(undefined);
    const [name, setName] = useState<string | undefined>(undefined);
    const [desc, setDesc] = useState<string | undefined>(undefined);

    const {id} = useParams();

    useEffect(() => {
        if (id != undefined) {
            const focusedWizform = schema.wizforms.find(w => w.id  == id);
            setWizform(focusedWizform);
            setCurrentElement(focusedWizform?.element);
            setEnabledForBook(focusedWizform?.enabled);
            setName(focusedWizform?.name);
            setDesc(focusedWizform?.desc);
        }
    }, [id])

    function handleEnableUpdate(enabled: boolean) {
        setEnabledForBook(enabled);
        schema.enabledUpdateCallback(wizform!, enabled); 
    }

    function handleNameUpdate(newName: string) {
        setName(newName);
        schema.nameUpdateCallback(wizform!, newName);
    }

    function handleDescUpdate(newDesc: string) {
        setDesc(newDesc);
        schema.descUpdateCallback(wizform!, newDesc);
    }

    function handleElementUpdate(element: number) {
        setElementSelectionEnabled(false);
        setCurrentElement(element);
        schema.elementUpdateCallback(wizform!, element); 
    }

    function handleFiltersUpdate(filters: number[]) {
        // console.log("Filters: ", filters);
        // schema.filtersUpdateCallback(schema.wizform, filters);
    }

    return (
        <>
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
                <Typography.Text 
                    style={{fontFamily: 'monospace', fontSize: 17, textAlign: 'center', paddingBottom: 5, paddingTop: 5}}
                >Дополнительные параметры</Typography.Text>
            </div>
        </>
    )
}