import { Col, Grid, Input, Layout, List, Menu, Row, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, MagicElement, Wizform, WizformElementType } from "./types";
import { Header } from "antd/es/layout/layout";
import { WizformFilterMenu } from "./WizformFilterMenu";
import { useWizformFilterContext } from "../contexts/WizformFilter";

interface WizformSelectorSchema {
    wizforms: Wizform[],
    elements: MagicElement[],
    filters: Filter[]
}

export function WizformSelector(schema: WizformSelectorSchema) {

    const [wizformsToRender, setWizformsToRender] = useState<Wizform[]>([]);

    const wizformFilterContext = useWizformFilterContext();

    useEffect(() => {
        console.log(schema.wizforms[0]);
        if (schema.wizforms.length > 0) {
            setWizformsToRender(schema.wizforms
                .filter((w) => w.enabled == true)
                .filter((w) => 
                    wizformFilterContext?.state.name == "" ? w : w.name.includes(wizformFilterContext?.state.name as string))
                .filter((w) => 
                    wizformFilterContext?.state.element == WizformElementType.None ? w : w.element == wizformFilterContext?.state.element)
                .filter((w) => 
                    wizformFilterContext?.state.custom == -1 ? w : w.filters.includes(wizformFilterContext?.state.custom as number))
            );
        }
    }, [schema.wizforms, wizformFilterContext?.state])

    return (
        <>
            <div>
                <WizformFilterMenu elements={schema.elements} filters={schema.filters}/>
                <List>
                    {wizformsToRender.map((w, index) => (
                        <List.Item key={index}>
                            <Link style={{width: "100%"}} to={`focus/${w.id}`}>
                                <Typography.Text>{w.name}</Typography.Text>
                            </Link>
                        </List.Item>
                    ))}
                </List> 
            </div>
        </>
    )
}