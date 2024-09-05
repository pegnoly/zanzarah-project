import VirtualList from 'rc-virtual-list';
import {List} from "antd";

export function WizformRenderer(
    {wizforms}: 
    {wizforms: string[]}
) {
    return (
        <>
            <List>
                <VirtualList data={wizforms} itemKey="wizform" itemHeight={47} height={400}>{
                    (item, index) => (
                        <List.Item key={index}>{item}</List.Item>
                    )
                }</VirtualList>
            </List>
        </>
    )
}