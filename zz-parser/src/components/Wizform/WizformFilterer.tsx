import { Button, Input, List, Modal, Select, Space, Typography } from "antd";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { Filter, MagicElement } from "./../types";
import { useState } from "react";
import { DeleteFilled } from "@ant-design/icons";
import { invoke } from "@tauri-apps/api/core";

interface WizformFiltererSchema {
    elements: MagicElement[],
    filterDisabledCallback: (type: number) => void
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

    function handleCustomFilterUpdate(filter: Filter | null) {
        if (filter != null) {
            invoke("update_filter", {filter: filter});
            if (filter.enabled == false) {
                schema.filterDisabledCallback(filter.filter_type);
            } 
        }
    }

    return (
        <>
            <Space>
                <Input style={{width: 150}}
                    onChange={(e) => handleNameFilterChange(e.currentTarget.value)}
                ></Input>
                <Select 
                    onChange={(e) => handleElementFilterChange(e)}
                    style={{width: 200}} 
                    listItemHeight={10} 
                    listHeight={250}
                >
                    <Select.Option key={-1} value={-1}>Все стихии</Select.Option>
                    {schema.elements.filter((e) => e.enabled).map((e, index) => (
                        <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                    ))}
                </Select>
                <CustomFilterHolder filterUpdateCallback={handleCustomFilterUpdate}/>
            </Space>
        </>
    )
}

interface CustomFilterHolderSchema {
    filterUpdateCallback: (filter: Filter | null) => void
}

function CustomFilterHolder(schema: CustomFilterHolderSchema) {

    const [open, setOpen] = useState<boolean>(false);
    const [newFilter, setNewFilter] = useState<string>("");

    const wizformFilterContext = useWizformFilterContext();
    
    function handleClose() {
        setOpen(false);
    }

    function handleNewFilterChange(s: string) {
        setNewFilter(s);
    }

    function handleNewFilterAdd() {
        //console.log("From context: ", wizformFilterContext?.state.custom);
        const disabledSorted = wizformFilterContext?.state.custom
            .filter(f => f.enabled == false)
            .sort((f1, f2) => f1.filter_type < f2.filter_type ? -1 : 1);
        //console.log("Sorted: ", disabledSorted)
        const firstDisabledFilter = wizformFilterContext?.state.custom
            .filter(f => f.enabled == false)
            .sort((f1, f2) => f1.filter_type < f2.filter_type ? -1 : 1)[0];
        const newFilters = wizformFilterContext?.state.custom.map((f, i) => {
            if(f.filter_type == firstDisabledFilter?.filter_type) {
                return {
                    ...f,
                    enabled: true,
                    name: newFilter
                }
            }
            else {
                return f
            }
        })

        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            custom: newFilters != undefined ? newFilters : wizformFilterContext.state.custom
        });

        schema.filterUpdateCallback(firstDisabledFilter != undefined ? {
            id: firstDisabledFilter?.id,
            name: newFilter,
            book_id: firstDisabledFilter?.book_id,
            enabled: true,
            filter_type: firstDisabledFilter.filter_type
        } : null) 
    }

    function handleFilterRemove(filterType: number) {
        const filterToRemove = wizformFilterContext?.state.custom.find(f => f.filter_type == filterType);
        const newFilters = wizformFilterContext?.state.custom.map((f, i) => {
            if(f.filter_type == filterType) {
                return {
                    ...f,
                    enabled: false,
                    name: ""
                }
            }
            else {
                return f
            }
        })

        wizformFilterContext?.setState({
            ...wizformFilterContext.state,
            custom: newFilters != undefined ? newFilters : wizformFilterContext.state.custom
        });

        schema.filterUpdateCallback(filterToRemove != undefined ? {
            id: filterToRemove?.id,
            name: "",
            book_id: filterToRemove?.book_id,
            enabled: false,
            filter_type: filterToRemove.filter_type
        } : null) 
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Настроить фильтры</Button>
            <Modal 
                open={open}
                onCancel={handleClose}
                onClose={handleClose}
            >
                <Space direction="horizontal" size={50}>
                    <List header="Имеющиеся фильтры">{
                        wizformFilterContext?.state.custom.filter(f => f.enabled).map((f, index) => (
                            <List.Item style={{width: 200}} key={index}>
                                <Space direction="horizontal">
                                    <Typography.Text>{f.name}</Typography.Text>
                                    <Button
                                        onClick={() => handleFilterRemove(f.filter_type)} 
                                        icon={<DeleteFilled/>}></Button>
                                </Space>
                            </List.Item>
                        ))
                    }</List>
                    <Space direction="vertical">
                        <Input defaultValue={newFilter} onChange={(e) => handleNewFilterChange(e.currentTarget.value)}/>
                        <Button 
                            style={{position: "relative", left: 20}}
                            onClick={handleNewFilterAdd}>Добавить фильтр</Button>
                    </Space>
                </Space>
            </Modal>
        </>
    )
}