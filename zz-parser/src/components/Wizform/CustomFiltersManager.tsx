import { DeleteFilled } from "@ant-design/icons";
import { Button, Col, Input, List, Modal, Row, Space, Typography } from "antd";
import { useState } from "react";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { Filter } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";


interface CustomFilterManagerSchema {
    filterUpdateCallback: (filter: Filter | null) => void
}

export function CustomFiltersManager(schema: CustomFilterManagerSchema) {

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
        const firstDisabledFilter = wizformFilterContext?.state.custom
            .filter(f => f.enabled == false)
            .sort((f1, f2) => f1.filter_type < f2.filter_type ? -1 : 1)[0];
        const newFilters = wizformFilterContext?.state.custom.map(f => {
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
        const newFilters = wizformFilterContext?.state.custom.map(f => {
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
            <Button onClick={() => setOpen(true)}>Настроить особые фильтры фей</Button>
            <Modal 
                height={500}
                width={700}
                open={open}
                onCancel={handleClose}
                onClose={handleClose}
                onOk={handleClose}
            >
                <div>
                    <Typography.Text>Имеющиеся фильтры</Typography.Text>
                    <Row>
                        <Col span={13} style={{height: 450, overflowY: 'scroll'}}>
                            <InfiniteScroll
                                next={() => {}}
                                hasMore={false}
                                loader={null}
                                dataLength={wizformFilterContext?.state.custom.length as number}>
                                    <List>{
                                    wizformFilterContext?.state.custom.filter(f => f.enabled).map((f, index) => (
                                        <List.Item key={index}>
                                            <Space direction="horizontal">
                                                <Typography.Text>{f.name}</Typography.Text>
                                                <Button
                                                    onClick={() => handleFilterRemove(f.filter_type)} 
                                                    icon={<DeleteFilled/>}></Button>
                                            </Space>
                                        </List.Item>
                                    ))
                                }</List>
                            </InfiniteScroll> 
                        </Col>
                        <Col offset={1} span={8} style={{display: 'flex', flexDirection: 'column', alignContent: 'center'}}>
                            <Input defaultValue={newFilter} onChange={(e) => handleNewFilterChange(e.currentTarget.value)}/>
                            <Button onClick={handleNewFilterAdd}>Добавить фильтр</Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    )
}