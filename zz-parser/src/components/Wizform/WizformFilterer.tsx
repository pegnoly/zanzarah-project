import { Col, Input, Row, Select } from "antd";
import { MagicElement } from "./../types";
import { useWizformStore } from "../../stores/Wisform";
import { useShallow } from "zustand/shallow";

interface WizformFiltererSchema {
    elements: MagicElement[],
}

/**
 * Performs filtering on wizform's data  
 * Saves filters in this component & renderer shared context  
 * @param schema - magic elements array is needed to select wizform element to render
 * @returns 
 */
export function WizformFilterer(schema: WizformFiltererSchema) {

    function handleNameFilterChange(filter: string) {
        updateNameFilter(filter);
    }

    function handleElementFilterChange(filter: number) {
        updateElementFilter(filter);
    }

    const [updateNameFilter, updateElementFilter] = useWizformStore(useShallow((state) => [state.update_name_filter, state.update_element_filter]));

    return (
        <>
            <Row style={{padding: 5}}>
                <Col offset={1} style={{display: 'flex', alignItems: 'center'}} span={11}>
                    <Input style={{width: '90%'}}
                        onChange={(e) => handleNameFilterChange(e.currentTarget.value)}
                    ></Input>
                </Col>
                <Col span={12}>
                    <Select 
                        onChange={(e) => handleElementFilterChange(e)}
                        style={{width: '90%'}} 
                        listItemHeight={10} 
                        listHeight={250}
                    >
                        <Select.Option key={-1} value={-1}>Все стихии</Select.Option>
                        {schema.elements.filter((e) => e.enabled).map((e, index) => (
                            <Select.Option key={index} value={e.element}>{e.name}</Select.Option>
                        ))}
                    </Select>
                </Col>
            </Row>
        </>
    )
}