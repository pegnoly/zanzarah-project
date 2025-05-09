import InfiniteScroll from 'react-infinite-scroll-component';
import { WizformListItem } from './WizformListItem';
import { Link } from 'react-router-dom';
import { List } from 'antd';
import { createStyles } from 'antd-style';
import { useWizformStore } from '../../stores/Wisform';

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
export function WizformRenderer() {

    //const bookInitialized = useBooksStore((state) => state.initialized);
    const idsToRender = useWizformStore((state) => state.ids_to_render);

    //console.log("Ids to render: ", idsToRender);

    const styles = wizformRendererStyles();

     return (
        <div id="scrollcontainer" className={styles.styles.container}>
            <InfiniteScroll
                dataLength={idsToRender.length}
                hasMore={false}
                next={() => {}}     
                loader={<h4>Загружается...</h4>}
                scrollableTarget="scrollcontainer"
            >
                <List>
                    {idsToRender.map((id, _) => (
                        <List.Item key={id}>
                            <Link to={`focus/${id}`}>
                                <WizformListItem id={id}/>
                            </Link>   
                        </List.Item>
                    ))}
                </List>
            </InfiniteScroll>
        </div>
    )
}