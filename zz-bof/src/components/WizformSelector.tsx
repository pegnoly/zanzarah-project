import { Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, MagicElement, Wizform, WizformElementType } from "./types";
import { WizformFilterMenu } from "./WizformFilterMenu";
import { useWizformFilterContext } from "../contexts/WizformFilter";

import List from 'rc-virtual-list';

interface WizformSelectorSchema {
    wizforms: Wizform[],
    elements: MagicElement[],
    filters: Filter[]
}

export function WizformSelector(schema: WizformSelectorSchema) {

    const [wizformsToRender, setWizformsToRender] = useState<Wizform[]>([]);

    const wizformFilterContext = useWizformFilterContext();

    useEffect(() => {
        if (schema.wizforms.length > 0) {
            setWizformsToRender(schema.wizforms
                .filter((w) => w.enabled == true)
                .filter((w) => 
                    wizformFilterContext?.state.name == "" ? w : w.name.includes(wizformFilterContext?.state.name as string))
                .filter((w) => 
                    wizformFilterContext?.state.element == WizformElementType.None ? w : w.element == wizformFilterContext?.state.element)
                .filter((w) => 
                    wizformFilterContext?.state.custom == -1 ? w : w.filters.includes(wizformFilterContext?.state.custom as number))
                .sort((w1, w2) => w1.number < w2.number ? -1 : 1)
            );
        }
    }, [schema.wizforms, wizformFilterContext?.state])

    return (
        <>
            <div>
                <WizformFilterMenu elements={schema.elements} filters={schema.filters}/>
                <List fullHeight={true} itemHeight={50} data={wizformsToRender} itemKey="id">
                    {index =>          
                        <Link key={index.number} to={`focus/${index.id}`}>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '2%'}}>
                                <img width={40} height={40} src={`data:image/bmp;base64,${index.icon}`} style={{paddingLeft: '3%'}}/>
                                <Typography.Text style={{fontFamily: 'sans-serif', paddingLeft: '2%'}}>{index.name}</Typography.Text>
                            </div>
                        </Link>
                    }            
                </List>
            </div>
        </>
    )
}