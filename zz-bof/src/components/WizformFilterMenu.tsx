import { Input, Menu, Select } from "antd"
import { WizformElementType } from "./types"
import { useWizformStore } from "../stores/Wizform";
import { useShallow } from "zustand/shallow";
import { useBooksStore } from "../stores/Book";


export function WizformFilterMenu() {

    // const wizformFilterContext = useWizformFilterContext();

    // function handleNameFilterUpdate(s: string) {
    //     wizformFilterContext?.setState({
    //         ...wizformFilterContext.state,
    //         name: s
    //     })
    // }

    // function handleElementSelection(element: WizformElementType) {
    //     wizformFilterContext?.setState({
    //         ...wizformFilterContext.state,
    //         element: element
    //     })
    // }

    // function handleCustomFilterSelection(type: number) {
    //     wizformFilterContext?.setState({
    //         ...wizformFilterContext.state,
    //         custom: type
    //     })
    // } 

    const [nameFilter, elementFilter, updateNameFilter, updateElementFilter] = useWizformStore(useShallow((state) => [
        state.name_filter, 
        state.element_filter, 
        state.update_name_filter,
        state.update_element_filter
    ]));

    const elements = useBooksStore((state) => state.elements);

    function handleNameFilterUpdate(filter: string) {
        updateNameFilter(filter);
    }

    function handleElementSelection(filter: WizformElementType) {
        updateElementFilter(filter as number);
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
                        style: {width: "48%", padding: "2%"},
                        label: (
                            <Input 
                                style={{width: "100%"}}
                                onChange={(e) => handleNameFilterUpdate(e.currentTarget.value)}
                                defaultValue={nameFilter}
                            />
                        )
                    },
                    {
                        type: "item",
                        key: "element_selector",
                        style: {width: "48%", padding: 1},
                        label: (
                            <Select 
                                onChange={(e) => handleElementSelection(e)} 
                                style={{width: "100%"}}
                                defaultValue={elementFilter}
                            >
                                <Select.Option
                                    value={WizformElementType.None} 
                                    key={-1}
                                >Все стихии</Select.Option> 
                                {elements.map((e, i) => (
                                <Select.Option 
                                    value={e.element} 
                                    key={i}
                                >{e.name}</Select.Option>
                            ))}</Select>
                        )
                    }
                    // {
                    //     type: "item",
                    //     key: "custom_selector",
                    //     style: {width: "33%", padding: 1},
                    //     label: (
                    //         <Select 
                    //             onChange={handleCustomFilterSelection}
                    //             style={{width: "100%"}}
                    //             defaultValue={wizformFilterContext?.state.custom}
                    //         >
                    //             <Select.Option 
                    //                 value={-1} 
                    //                 key={-1}
                    //             >Без доп. фильтра</Select.Option> 
                    //             {schema.filters.filter(f => f.enabled).map((f, i) => (
                    //             <Select.Option key={i} value={f.filter_type}>{f.name}</Select.Option>
                    //         ))}</Select>
                    //     )
                    // }
                ]}>
            </Menu>
        </>
    )
}