import { Button, Checkbox, List, Space, Typography } from "antd";
import VirtualList from 'rc-virtual-list';

export type MagicElement = {
    id: string,
    name: string,
    type: string,
    enabled: boolean
}

export function ElementRenderer(
    {elements} : 
    {elements: MagicElement[]}
) {
    return (
        <>
            <List>
                <VirtualList data={elements} itemKey="element" itemHeight={47} height={400}>{
                    (item, index) => (
                        <List.Item key={index}>{item.name}
                            {/* <div>
                                <Space direction="horizontal">
                                    <Typography.Text>{item.name}</Typography.Text>
                                    <Checkbox checked={item.enabled}/>
                                    <Button>Настроить элемент</Button>
                                </Space>
                            </div> */}
                        </List.Item>
                    )
                }</VirtualList>
            </List>
        </>
    )
}