import { Col, Input, Row, Select } from "antd";
import { useWizformFilterContext } from "../../contexts/WizformFilter";
import { MagicElement } from "./../types";

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