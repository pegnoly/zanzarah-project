import useMapStore from "@/stores/map";
import { AuthProps, RegistrationState, UserPermissionType } from "@/utils/auth/utils";
import { Location, LocationWizformEntry, SelectableWizform } from "@/utils/queries/map/types";
import { Modal } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import EditorTabs from "./editorTabs";
import WizformsList from "./wizformsList";

function LocationFocused(params: {
    bookId: string,
    sectionId: string,
    auth: AuthProps,
    location: Location,
    entries: LocationWizformEntry [],
    selectables: SelectableWizform [],
}) {
    const navigate = useNavigate();
    const [entries, setEntries, selectables, setSelectables] = useMapStore(useShallow((state) => [
        state.entriesData,
        state.setEntries,
        state.selectablesData,
        state.setSelectables,
    ]));

    console.log("Entries in top component: ", entries);

    if (entries?.get(params.location.id) == undefined) {
        const updatedEntriesData = entries?.set(params.location.id, params.entries);
        setEntries(updatedEntriesData!);
    }
    if (selectables?.get(params.location.id) == undefined) {
        const updatedSelectablesData = selectables?.set(params.location.id, params.selectables);
        setSelectables(updatedSelectablesData!);
    }

    async function entryAdded(wizformId: string, entry: LocationWizformEntry) {
        setSelectables(selectables?.set(params.location.id, selectables.get(params.location.id)?.filter(s => s.id != wizformId))!);
        setEntries(entries?.set(params.location.id, [...entries.get(params.location.id)!, entry])!);
    }

    async function entryRemoved(entryId: string, selectable: SelectableWizform) {
        setEntries(entries?.set(params.location.id, entries.get(params.location.id)?.filter(e => e.id != entryId))!);
        setSelectables(selectables?.set(params.location.id, [...selectables.get(params.location.id)!, selectable])!);
    }

    async function commentAdded(entryId: string, comment: string) {
        // const updatedEntries = entries?.get(params.location.id)?.map(e => {
        //     if (e.id == entryId) {
        //         e.comment = comment;
        //         return e;
        //     }
        //     return e;
        // });
        // const updatedEntriesMap = entries?.set(params.location.id, updatedEntries);
        setEntries(entries?.set(params.location.id, entries.get(params.location.id)?.map(e => {
            if (e.id == entryId) {
                e.comment = comment;
                return e;
            }
            return e;
        }))!);
    }

    async function commentDeleted(entryId: string) {
        setEntries(entries?.set(params.location.id, entries.get(params.location.id)?.map(e => {
            if (e.id == entryId) {
                e.comment = null;
                return e;
            }
            return e;
        }))!); 
    }

    return <>
    <Modal.Root opened={true} centered={true} onClose={() => navigate({to: '/map/$bookId/section/$id', params: {bookId: params.bookId, id: params.sectionId}})}>
        <Modal.Overlay/>
        <Modal.Content>
            <Modal.Header>
                <Modal.Title style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '2rem'}}>{`Феи локации ${params.location.name}`}</Modal.Title>
                <Modal.CloseButton/>
            </Modal.Header>
            <Modal.Body>
            {
                params.auth.userState == RegistrationState.Confirmed && 
                (params.auth.userPermission == UserPermissionType.Editor || params.auth.userPermission == UserPermissionType.Admin) ?
                <EditorTabs 
                    auth={params.auth}
                    currentLocation={params.location.id}
                    entryAddedCallback={entryAdded}
                    entryRemovedCallback={entryRemoved}
                    commentAddedCallback={commentAdded}
                    commentDeletedCallback={commentDeleted}
                /> :
                <WizformsList 
                    modelRemovedCallback={entryRemoved}
                    auth={params.auth}
                    currentLocation={params.location.id}
                    commentAddedCallback={commentAdded}
                    commentDeletedCallback={commentDeleted}
                />  
            }
            </Modal.Body>
        </Modal.Content>
    </Modal.Root>
    </>
}

export default LocationFocused;