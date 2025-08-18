import WizformsList from "./wizformsList";
import { useNavigate, useParams } from "react-router";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import type { LocationWizformEntry } from "@/queries/map/types";
import { useEffect, useState } from "react";
import { useLocationEntries } from "@/queries/map/locationEntriesQuery";
import { DialogTitle } from "@radix-ui/react-dialog";

function LocationFocused() {
    const navigate = useNavigate();
    const { bookId, sectionId, locationId } = useParams();

    const [entries, setEntries] = useState<LocationWizformEntry[] | undefined>(undefined);
    // const [entries, setEntries, selectables, setSelectables] = useMapStore(useShallow((state) => [
    //     state.entriesData,
    //     state.setEntries,
    //     state.selectablesData,
    //     state.setSelectables,
    // ]));

    // console.log("Entries in top component: ", entries);

    // if (entries?.get(params.location.id) == undefined) {
    //     const updatedEntriesData = entries?.set(params.location.id, params.entries);
    //     setEntries(updatedEntriesData!);
    // }
    // if (selectables?.get(params.location.id) == undefined) {
    //     const updatedSelectablesData = selectables?.set(params.location.id, params.selectables);
    //     setSelectables(updatedSelectablesData!);
    // }

    // async function entryAdded(wizformId: string, entry: LocationWizformEntry) {
    //     setSelectables(selectables?.set(params.location.id, selectables.get(params.location.id)?.filter(s => s.id != wizformId))!);
    //     setEntries(entries?.set(params.location.id, [...entries.get(params.location.id)!, entry])!);
    // }

    // async function entryRemoved(entryId: string, selectable: SelectableWizform) {
    //     setEntries(entries?.set(params.location.id, entries.get(params.location.id)?.filter(e => e.id != entryId))!);
    //     setSelectables(selectables?.set(params.location.id, [...selectables.get(params.location.id)!, selectable])!);
    // }

    // async function commentAdded(entryId: string, comment: string) {
    //     // const updatedEntries = entries?.get(params.location.id)?.map(e => {
    //     //     if (e.id == entryId) {
    //     //         e.comment = comment;
    //     //         return e;
    //     //     }
    //     //     return e;
    //     // });
    //     // const updatedEntriesMap = entries?.set(params.location.id, updatedEntries);
    //     setEntries(entries?.set(params.location.id, entries.get(params.location.id)?.map(e => {
    //         if (e.id == entryId) {
    //             e.comment = comment;
    //             return e;
    //         }
    //         return e;
    //     }))!);
    // }

    // async function commentDeleted(entryId: string) {
    //     setEntries(entries?.set(params.location.id, entries.get(params.location.id)?.map(e => {
    //         if (e.id == entryId) {
    //             e.comment = null;
    //             return e;
    //         }
    //         return e;
    //     }))!); 
    // }

    return <>
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
        <DialogContent>
            <DialogTitle>Феи локации</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
            <WizformsList entries={entries}/>
        </DialogContent>
    </Dialog>
    <EntriesLoader locationId={locationId!} onLoad={setEntries}/>
    {/* // <Modal.Root opened={true} centered={true} onClose={() => navigate({to: '/map/$bookId/section/$id', params: {bookId: params.bookId, id: params.sectionId}})}>
    //     <Modal.Overlay/>
    //     <Modal.Content>
    //         <Modal.Header>
    //             <Modal.Title style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{`Феи локации ${params.location.name}`}</Modal.Title>
    //             <Modal.CloseButton/>
    //         </Modal.Header>
    //         <Modal.Body>
    //         {
    //             params.auth.userState == RegistrationState.Confirmed && 
    //             (params.auth.userPermission == UserPermissionType.Editor || params.auth.userPermission == UserPermissionType.Admin) ?
    //             <EditorTabs 
    //                 auth={params.auth}
    //                 currentLocation={params.location.id}
    //                 entryAddedCallback={entryAdded}
    //                 entryRemovedCallback={entryRemoved}
    //                 commentAddedCallback={commentAdded}
    //                 commentDeletedCallback={commentDeleted}
    //             /> :
    //             <WizformsList 
    //                 modelRemovedCallback={entryRemoved}
    //                 auth={params.auth}
    //                 currentLocation={params.location.id}
    //                 commentAddedCallback={commentAdded}
    //                 commentDeletedCallback={commentDeleted}
    //             />  
    //         }
    //         </Modal.Body>
    //     </Modal.Content>
    // </Modal.Root> */}
    </>
}

function EntriesLoader({locationId, onLoad}: {locationId: string, onLoad: (value: LocationWizformEntry[]) => void}) {
    const { data } = useLocationEntries(locationId);
    
    useEffect(() => {
        if (data != undefined) {
            onLoad(data.locationEntries);
        }
    }, [data]);

    return null;
}

export default LocationFocused;