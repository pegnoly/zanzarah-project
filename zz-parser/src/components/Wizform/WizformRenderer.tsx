import {Button, Checkbox, Space, Typography} from "antd";
import { useEffect, useState } from 'react';
import { MagicElement, Wizform } from './../types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useWizformFilterContext } from '../../contexts/WizformFilter';
import { WizformEditor } from "./WizformEditor";

export interface WizformsRendererSchema {
    wizforms: Wizform[],
    elements: MagicElement[]
}

/**
 * Renders a list of wizforms with current filters  
 * @param schema - wizforms array to render, elements array to get names of wizform's elements
 * @returns 
 */
export function WizformRenderer(schema: WizformsRendererSchema) {

    const [wizformsToRender, setWizformsToRender] = useState<Wizform[]>([]);
    const [wizformToEdit, setWizformToEdit] = useState<Wizform | null>(null);

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


    function wizformToEditSelected(w: Wizform) {
        console.log("Wizform selected: ", w);
        setWizformToEdit(w);
    }

    function onWizformEditionFinished() {
        // invoke("update_wizform", {model: wizformToEdit})
        setWizformToEdit(null);
    }

    function onWizformEditionCancelled() {
        setWizformToEdit(null);
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
                     <Space style={{paddingTop : 5, paddingBottom : 5}} key={index} size={45}>
                     <div 
                         style={{width : 230, paddingLeft : 10 }}>
                         <Typography.Text>{w.name}</Typography.Text>
                     </div>
                     <div 
                         style={{width : 100}}>
                         <Typography.Text>{schema.elements.find((e) => e.element == w.element)?.name}</Typography.Text>
                     </div>
                     <Checkbox>Отображать в книге</Checkbox>
                     <Button size='small' onClick={() => wizformToEditSelected(w)}>Редактировать</Button>
                 </Space>
                ))}
            </InfiniteScroll>
            <WizformEditor 
                wizform={wizformToEdit} 
                elements={schema.elements} 
                callbackOk={onWizformEditionFinished}
                callbackCancel={onWizformEditionCancelled}/>
        </div>
    )
}