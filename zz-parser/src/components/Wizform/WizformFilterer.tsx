import { Button, Input, Select, Space } from "antd";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { MagicElement } from "./../types";
import { useState } from "react";

interface WizformFiltererSchema {
    elements: MagicElement[]
}

/**
 * Performs filtering on wizform's data  
 * Saves filters in this component & renderer shared context  
 * @param schema - magic elements array is needed to select wizform element to render
 * @returns 
 */
export function WizformFilterer(schema: WizformFiltererSchema) {

    const [filter, setFilter] = useState<string>("");

    const wizformFilterContext = useWizformFilterContext();

    function handleNameFilterChange(filter: string) {
        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            name: filter
        })
    }

    function handleElementFilterChange(filter: number) {
        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            element: filter
        })
    }

    function handleCustomFilterNameChange(s: string) {
        setFilter(s);
    }

    function handleCustomFilterAdd() {
        let currentFilters = wizformFilterContext?.state.custom;
        currentFilters?.push({
            name: filter,
            filter_type: currentFilters.length,
            enabled: true
        })
        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            custom: currentFilters?.length != undefined ? currentFilters : []
        });
    }

    return (
        <>
            <Space>
                <Input 
                    onChange={(e) => handleNameFilterChange(e.currentTarget.value)}
                ></Input>
                <Select 
                    onChange={(e) => handleElementFilterChange(e)}
                    style={{width: 250}} 
                    listItemHeight={10} 
                    listHeight={250}
                >
                    <Select.Option key={-1} value={-1}>Все стихии</Select.Option>
                    {schema.elements.filter((e) => e.enabled).map((e, index) => (
                        <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                    ))}
                </Select>
                <Input style={{width: 100}} onChange={(e) => handleCustomFilterNameChange(e.currentTarget.value)}></Input>
                <Button onClick={handleCustomFilterAdd}>+</Button>
            </Space>
        </>
    )
}