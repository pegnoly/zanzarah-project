import { Wizform } from './../types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { WizformListItem } from './WizformListItem';
import { Link } from 'react-router-dom';
import { List } from 'antd';
import { createStyles } from 'antd-style';

interface WizformsRendererSchema {
    wizforms: Wizform[],
}

const wizformRendererStyles = createStyles(({}) => ({
    container: {
        width: '100%',
        height: '59dvh',
        overflowY: 'scroll'
    }
}))

/**
 * Renders a list of wizforms with current filters  
 * @param schema - wizforms array to render, elements array to get names of wizform's elements
 * @returns 
 */
export function WizformRenderer(schema: WizformsRendererSchema) {

    const styles = wizformRendererStyles();

     return (
        <div id="scrollcontainer" className={styles.styles.container}>
            <InfiniteScroll
                dataLength={schema.wizforms.length}
                hasMore={false}
                next={() => {}}     
                loader={<h4>Загружается...</h4>}
                scrollableTarget="scrollcontainer"
            >
                <List>
                    {schema.wizforms.map((w, index) => (
                        <List.Item key={index}>
                            <Link to={`focus/${w.id}`}>
                                <WizformListItem name={w.name} icon64={w.icon}/>
                            </Link>   
                        </List.Item>
                    ))}
                </List>
            </InfiniteScroll>
        </div>
    )
}