import { Input, Menu, Select } from "antd"
import { Filter, MagicElement, WizformElementType } from "./types"
import { useWizformFilterContext } from "../contexts/WizformFilter";

interface WizformFilterMenuSchema {
    elements: MagicElement[],
    filters: Filter[]
}

export function WizformFilterMenu(schema: WizformFilterMenuSchema) {

    const wizformFilterContext = useWizformFilterContext();

    function handleNameFilterUpdate(s: string) {
        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            name: s
        })
    }

    function handleElementSelection(element: WizformElementType) {
        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            element: element
        })
    }

    function handleCustomFilterSelection(type: number) {
        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            custom: type
        })
    } 

    return (
        <>
            <Menu mode="horizontal" 
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: 'vw100',
                    // display: 'flex',
                    alignItems: 'center'
                }}
                items={[
                    {
                        type: "item",
                        key: "name_selector",
                        style: {width: "32%", padding: 1},
                        label: (
                            <Input 
                                style={{width: "100%"}}
                                onChange={(e) => handleNameFilterUpdate(e.currentTarget.value)}
                                defaultValue={wizformFilterContext?.state.name}
                            />
                        )
                    },
                    {
                        type: "item",
                        key: "element_selector",
                        style: {width: "32%", padding: 1},
                        label: (
                            <Select 
                                onChange={(e) => handleElementSelection(e)} 
                                style={{width: "100%"}}
                                defaultValue={wizformFilterContext?.state.element}
                            >
                                <Select.Option
                                    value={WizformElementType.None} 
                                    key={-1}
                                >Все стихии</Select.Option> 
                                {schema.elements.map((e, i) => (
                                <Select.Option 
                                    value={e.element} 
                                    key={i}
                                >{e.name}</Select.Option>
                            ))}</Select>
                        )
                    },
                    {
                        type: "item",
                        key: "custom_selector",
                        style: {width: "33%", padding: 1},
                        label: (
                            <Select 
                                onChange={handleCustomFilterSelection}
                                style={{width: "100%"}}
                                defaultValue={wizformFilterContext?.state.custom}
                            >
                                <Select.Option 
                                    value={-1} 
                                    key={-1}
                                >Без доп. фильтра</Select.Option> 
                                {schema.filters.filter(f => f.enabled).map((f, i) => (
                                <Select.Option key={i} value={f.filter_type}>{f.name}</Select.Option>
                            ))}</Select>
                        )
                    }
                ]}>
            </Menu>
        </>
    )
}