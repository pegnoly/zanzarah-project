import { Button, Checkbox, Space, Typography } from "antd";
import { MagicElement } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";

export interface ElementRendererSchema {
    elements: MagicElement[]
}

/**
 * Renders a list of book's magic elements
 * @param schema - elements to render
 * @returns 
 */
export function ElementRenderer(schema: ElementRendererSchema) {
    return (
        <>
            <div style={{paddingTop : 10, paddingBottom : 10, paddingLeft : 50, paddingRight : 50}}>
                <InfiniteScroll
                    dataLength={schema.elements.length}
                    hasMore={false}
                    next={() => {}}     
                    loader={null}
                    height={400}
                >
                    {schema.elements.map((e, index) => (
                        <Space style={{paddingTop : 5, paddingBottom : 5}} key={index} size={80}>
                        <div 
                            style={{width : 200, paddingLeft : 10 }}>
                            <Typography.Text>{e.name}</Typography.Text>
                        </div>
                        <Checkbox checked={e.enabled}>Использовать</Checkbox>
                        <Button size='small'>Редактировать</Button>
                    </Space>
                    ))}
                </InfiniteScroll>
            </div>
        </>
    )
}