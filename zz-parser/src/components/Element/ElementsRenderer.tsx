import { Checkbox, Space, Typography } from "antd";
import { MagicElement } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";

export interface ElementRendererSchema {
    elements: MagicElement[],
    updateCallback: (e: MagicElement) => void
}

/**
 * Renders a list of book's magic elements
 * @param schema - elements to render
 * @returns 
 */
export function ElementRenderer(schema: ElementRendererSchema) {

    function hangleElementNameUpdate(element: MagicElement, newName: string) {
        schema.updateCallback({
            ...element,
            name: newName
        })
    }

    function handleElementChecked(element: MagicElement, checked: boolean) {
        schema.updateCallback({
            ...element,
            enabled: checked
        })
    }

    return (
        <>
            <div style={{paddingTop : 10, paddingBottom : 10, paddingLeft : 50, paddingRight : 50, width: 500}}>
                <InfiniteScroll
                    dataLength={schema.elements.length}
                    hasMore={false}
                    next={() => {}}     
                    loader={null}
                    height={400}
                >
                    {schema.elements.sort((e1, e2) => (e1.element < e2.element ? -1 : 1)).map((element, index) => (
                        <Space style={{paddingTop : 5, paddingBottom : 5}} key={index} size={80}>
                        <div 
                            style={{width : 200, paddingLeft : 10 }}>
                            <Typography.Text editable={{
                                onChange: (newText) => {hangleElementNameUpdate(element, newText)}
                            }}>{element.name}</Typography.Text>
                        </div>
                        <Checkbox 
                            checked={element.enabled} 
                            onChange={(event) => handleElementChecked(element, event.target.checked)}
                        >Использовать</Checkbox>
                    </Space>
                    ))}
                </InfiniteScroll>
            </div>
        </>
    )
}