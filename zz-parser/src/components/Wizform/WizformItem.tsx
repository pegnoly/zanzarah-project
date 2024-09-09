import { useState } from "react";
import { MagicElement, Wizform } from "../types";
import { Button, Checkbox, Select, Space, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";

/**
 * Props of wizform render
 */
interface WizformElementSchema {
    /**
     * Wizform to render
     */
    wizform: Wizform,
    /**
     * Elements are needed to change wizform element
     */
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
    nameUpdateCallback: (w: Wizform, name: string) => void
}

/**
 * Renders a single wizform  
 * @param schema - props to render
 * @returns 
 */
export function WizformItem(schema: WizformElementSchema) {

    const [elementSelectionEnabled, setElementSelectionEnabled] = useState<boolean>(false);
    const [currentElement, setCurrentElement] = useState<number>(schema.wizform.element);
    const [enabledForBook, setEnabledForBook] = useState<boolean>(schema.wizform.enabled);
    //const [name, setName] = useState<string>(schema.wizform.name);

    function handleEnableUpdate(enabled: boolean) {
        setEnabledForBook(enabled);
        schema.enabledUpdateCallback(schema.wizform, enabled); 
    }

    function handleNameUpdate(newName: string) {
        //setName(newName);
        schema.nameUpdateCallback(schema.wizform, newName);
    }

    function handleElementUpdate(element: number) {
        setElementSelectionEnabled(false);
        setCurrentElement(element);
        schema.elementUpdateCallback(schema.wizform, element); 
    }

    return (
        <>
            <Space style={{paddingTop : 5, paddingBottom : 5}} size={45}>
                <div 
                    style={{width : 230, paddingLeft : 10 }}>
                    <Typography.Text editable={{
                        onChange: (newText) => {handleNameUpdate(newText)}
                    }}>{schema.wizform.name}</Typography.Text>
                </div>
                <div 
                    style={{width : 250}}
                >
                    <Space direction="horizontal">
                        <Select 
                            style={{width: 200}}
                            disabled={!elementSelectionEnabled} 
                            defaultValue={currentElement}
                            value={schema.wizform.element}
                            onChange={(e) => handleElementUpdate(e)}
                        >
                        {schema.elements.filter((e) => e.enabled).map((e, index) => (
                            <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                        ))}</Select>
                    </Space>
                    <Button
                        type="link"
                        style={{
                            color: elementSelectionEnabled ? "red" : "blue"
                        }}
                        shape="default"
                        icon={<EditOutlined/>}
                        onClick={() => setElementSelectionEnabled(!elementSelectionEnabled)}
                    />
                </div>
                <Checkbox 
                    checked={enabledForBook}
                    onChange={(event) => handleEnableUpdate(event.target.checked)}
                >Отображать в книге</Checkbox>
            </Space>
        </>
    )
}