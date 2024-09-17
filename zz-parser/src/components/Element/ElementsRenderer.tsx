import { Checkbox, List, Typography } from "antd";
import { MagicElement } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import { createStyles } from "antd-style";

const elementRendererStyles = createStyles(({}) => ({
    container: {
        width: '35%',
        height: '59dvh',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        paddingLeft: '5%'
    }
}))


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

    const styles = elementRendererStyles();

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
            <div className={styles.styles.container} 
            // style={{paddingTop : 10, paddingBottom : 10, paddingLeft : 50, paddingRight : 50, width: 500}}
            >
                <InfiniteScroll
                    dataLength={schema.elements.length}
                    hasMore={false}
                    next={() => {}}     
                    loader={null}
                    // height={400}
                >
                    <List>
                    {schema.elements.sort((e1, e2) => (e1.element < e2.element ? -1 : 1)).map((element, index) => (
                        <List.Item key={index}>
                            <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <div style={{width: '50%'}}>
                                    <Typography.Text editable={{
                                        onChange: (newText) => {hangleElementNameUpdate(element, newText)}
                                    }}>{element.name}</Typography.Text>
                                </div>
                                <Checkbox 
                                    checked={element.enabled} 
                                    onChange={(event) => handleElementChecked(element, event.target.checked)}
                                >Использовать</Checkbox>
                            </div>
                        </List.Item>
                    ))}
                    </List>
                </InfiniteScroll>
            </div>
        </>
    )
}