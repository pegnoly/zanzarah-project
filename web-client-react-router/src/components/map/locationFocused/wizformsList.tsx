import { Accordion, List, Loader } from "@mantine/core";
import WizformsListItem from "./wizformListItem";
import type { LocationWizformEntry } from "@/queries/map/types";
import { useActiveBook } from "@/contexts/activeBook";

function WizformsList({entries}: {
    entries: LocationWizformEntry[] | undefined
    // currentLocation: string,
    // auth: AuthProps,
    // modelRemovedCallback: (id: string, selectable: SelectableWizform) => void,
    // commentAddedCallback: (id: string, comment: string) => void,
    // commentDeletedCallback: (id: string) => void
}) {
    const activeBook = useActiveBook();
    // const elements = useCommonStore(useShallow((state) => state.elements));
    // const entries = useMapStore(useShallow((state) => state.entriesData?.get(params.currentLocation)));
    // console.log("Entries: ", entries);

    const presentedElements = [...new Set(entries?.map(m => m.wizformElement))];
    
    // async function itemDeleted(id: string, selectable: SelectableWizform) {
    //     params.modelRemovedCallback(id, selectable);
    // }

    // async function commentAdded(id: string, comment: string) {
    //     params.commentAddedCallback(id, comment);
    // }

    // async function commentDeleted(id: string) {
    //     params.commentDeletedCallback(id);
    // }

    return <>
    {
        entries == undefined || activeBook?.elements == undefined ? <Loader/> : 
        <Accordion>{presentedElements.map((e, i) => (
            <Accordion.Item key={i} value={e}>
                <Accordion.Control style={{backgroundColor: 'silver'}}>{activeBook.elements?.find(el => el.element == e)?.name}</Accordion.Control>
                <Accordion.Panel>
                <div style={{overflowY: 'auto', maxHeight: 500}}>
                    <List>{entries!
                        .filter(m => m.wizformElement == e)
                        .map(m => (
                        <WizformsListItem 
                            key={m.id} 
                            item={m} 
                            // auth={params.auth} 
                            // deletedCallback={itemDeleted} 
                            // commentAddedCallback={commentAdded}
                            // commentDeletedCallback={commentDeleted}
                        />
                    ))}</List> 
                </div>
                </Accordion.Panel>
            </Accordion.Item>
        ))}
        </Accordion>
    }
    </>
}

export default WizformsList;