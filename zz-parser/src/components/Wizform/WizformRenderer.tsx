import { Wizform } from './../types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WizformListItem } from './WizformListItem';
import { Link } from 'react-router-dom';
import { List } from 'antd';

interface WizformsRendererSchema {
    wizforms: Wizform[],
}

/**
 * Renders a list of wizforms with current filters  
 * @param schema - wizforms array to render, elements array to get names of wizform's elements
 * @returns 
 */
export function WizformRenderer(schema: WizformsRendererSchema) {

     return (
        <div style={{width: '100%', height: 500, overflowY: 'scroll'}}>
            <InfiniteScroll
                dataLength={schema.wizforms.length}
                hasMore={false}
                next={() => {}}     
                loader={<h4>Загружается...</h4>}
                // height={500}
            >
                <List>
                    {schema.wizforms.map((w, index) => (
                        <List.Item>
                            <Link to={`focus/${w.id}`}>
                                <WizformListItem key={index} name={w.name} icon64={w.icon}/>
                            </Link>   
                        </List.Item>
                    ))}
                </List>
            </InfiniteScroll>
        </div>
    )
}