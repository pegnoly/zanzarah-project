import { Button, Input, List, Modal, Select, Space, Typography } from "antd";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { MagicElement } from "./../types";
import { useState } from "react";
import { DeleteFilled } from "@ant-design/icons";

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
                <CustomFilterHolder/>
            </Space>
        </>
    )
}

function CustomFilterHolder() {

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
        const firstDisabledFilter = wizformFilterContext?.state.custom.filter(f => f.enabled == false)[0];
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
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}>Настроить фильтры</Button>
            <Modal 
                open={open}
                onCancel={handleClose}
                onClose={handleClose}
            >
                <Space direction="horizontal">
                    <List header="Имеющиеся фильтры">{
                        wizformFilterContext?.state.custom.filter(f => f.enabled).map((f, index) => (
                            <List.Item>
                                <Space direction="horizontal">
                                    <Typography.Text key={index}>{f.name}</Typography.Text>
                                    <Button icon={<DeleteFilled/>}></Button>
                                </Space>
                            </List.Item>
                        ))
                    }</List>
                    <Input defaultValue={newFilter} onChange={(e) => handleNewFilterChange(e.currentTarget.value)}/>
                    <Button onClick={handleNewFilterAdd}>Добавить фильтр</Button>
                </Space>
            </Modal>
        </>
    )
}