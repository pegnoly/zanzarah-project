import { useEffect, useState } from 'react';
import { Filter, MagicElement, Wizform } from './../types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useWizformFilterContext } from '../../contexts/WizformFilter';
import { WizformItem } from './WizformItem';

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
            setWizformsToRender(schema.wizforms
                .filter((w) => wizformFilterContext?.state.name == "" ? w : w.name.includes(wizformFilterContext?.state.name as string))
                .filter((w) => wizformFilterContext?.state.element == -1 ? w : w.element == wizformFilterContext?.state.element)
            );
        }
    }, [schema.wizforms, wizformFilterContext?.state.name, wizformFilterContext?.state.element]);

    function onWizformEnabledUpdated(wizform: Wizform, enabled: boolean) {
        schema.onUpdate({
            ...wizform,
            enabled: enabled
        });
    }

    function onWizformElementUpdated(wizform: Wizform, element: number) {
        schema.onUpdate({
            ...wizform,
            element: element
        });
    }

    function onWizformNameUpdated(wizform: Wizform, name: string) {
        schema.onUpdate({
            ...wizform,
            name: name
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
                    <WizformItem
                        key={index}
                        wizform={w}
                        elements={schema.elements}
                        elementUpdateCallback={onWizformElementUpdated}
                        enabledUpdateCallback={onWizformEnabledUpdated}
                        nameUpdateCallback={onWizformNameUpdated}
                    />
                ))}
            </InfiniteScroll>
        </div>
    )
}