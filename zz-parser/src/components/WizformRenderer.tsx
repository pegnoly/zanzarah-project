import VirtualList from 'rc-virtual-list';
import {List} from "antd";
import { Wizform } from './BooksFacade';

export function WizformRenderer(
    {wizforms}: 
    {wizforms: Wizform[]}
) {
    return (
        <>
            <List>
                <VirtualList data={wizforms} itemKey="wizform" itemHeight={47} height={400}>{
                    (item, index) => (
                        <List.Item key={index}>{item.name}</List.Item>
                    )
                }</VirtualList>
            </List>
        </>
    )
}