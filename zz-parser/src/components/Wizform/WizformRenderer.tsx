import {Button, Checkbox, Select, Space, Typography} from "antd";
import { useEffect, useState } from 'react';
import { MagicElement, Wizform } from './../types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useWizformFilterContext } from '../../contexts/WizformFilter';
import { EditOutlined } from "@ant-design/icons";

export interface WizformsRendererSchema {
    wizforms: Wizform[],
    elements: MagicElement[],
    onUpdate: (w: Wizform) => void
}

/**
 * Renders a list of wizforms with current filters  
 * @param schema - wizforms array to render, elements array to get names of wizform's elements
 * @returns 
 */
export function WizformRenderer(schema: WizformsRendererSchema) {

    const [wizformsToRender, setWizformsToRender] = useState<Wizform[]>([]);

    const wizformFilterContext = useWizformFilterContext();

    // initially all wizforms must be rendered(until i implement storing of filters)
    useEffect(() => {
        if (schema.wizforms.length > 0) {
            setWizformsToRender(schema.wizforms);
            return;
        }
    }, [schema.wizforms]);

    // when any filter is changed, renderable wizforms must be updated with filters
    useEffect(() => {
        setWizformsToRender(schema.wizforms
            .filter((w) => wizformFilterContext?.state.name == "" ? w : w.name.includes(wizformFilterContext?.state.name as string))
            .filter((w) => wizformFilterContext?.state.element == -1 ? w : w.element == wizformFilterContext?.state.element)
        );
    }, [wizformFilterContext?.state.name, wizformFilterContext?.state.element])

    function onWizformEnabledUpdated(wizform: Wizform, enabled: boolean) {
    }

    function onWizformElementUpdated(wizform: Wizform, element: number) {
        schema.onUpdate({
            ...wizform,
            element: element
        });
    }

    return (
        <div style={{paddingTop : 10, paddingBottom : 10}}>
            <InfiniteScroll
                dataLength={wizformsToRender.length}
                hasMore={false}
                next={() => {}}     
                loader={null}
                height={400}
            >
                {wizformsToRender.map((w, index) => (
                    <WizformElement
                        key={index}
                        wizform={w}
                        elements={schema.elements}
                        elementUpdateCallback={onWizformElementUpdated}
                        enabledUpdateCallback={onWizformEnabledUpdated}
                    />
                ))}
            </InfiniteScroll>
        </div>
    )
}

interface WizformElementSchema {
    wizform: Wizform,
    elements: MagicElement[],
    elementUpdateCallback: (w: Wizform, element: number) => void,
    enabledUpdateCallback: (w: Wizform, enabled: boolean) => void
}

function WizformElement(schema: WizformElementSchema) {

    const [elementSelectionEnabled, setElementSelectionEnabled] = useState<boolean>(false);
    const [currentElement, setCurrentElement] = useState<number>(schema.wizform.element);

    function handleEnableUpdate(enabled: boolean) {
        schema.enabledUpdateCallback(schema.wizform, enabled); 
    }

    function handleElementUpdate(element: number) {
        schema.elementUpdateCallback(schema.wizform, element); 
    }

    return (
        <>
            <Space style={{paddingTop : 5, paddingBottom : 5}} size={45}>
                <div 
                    style={{width : 230, paddingLeft : 10 }}>
                    <Typography.Text>{schema.wizform.name}</Typography.Text>
                </div>
                <div 
                    style={{width : 250}}
                >
                    <Space direction="horizontal">
                        <Select 
                            style={{width: 200}}
                            disabled={!elementSelectionEnabled} 
                            defaultValue={schema.wizform.element}
                            value={currentElement}
                            onChange={(e) => setCurrentElement(e)}
                        >
                        {schema.elements.map((e, index) => (
                            <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                        ))}</Select>
                    </Space>
                    <Button
                        //type="dashed"
                        style={{
                            color: elementSelectionEnabled ? "red" : "black"
                        }}
                        shape="circle"
                        icon={<EditOutlined/>}
                        onClick={() => setElementSelectionEnabled(!elementSelectionEnabled)}
                    />
                </div>
                <Checkbox>Отображать в книге</Checkbox>
            </Space>
        </>
    )
}