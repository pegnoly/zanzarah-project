import { useCommonStore } from "@/stores/common";
import useMapStore from "@/stores/map";
import { AuthProps, RegistrationState, UserPermissionType } from "@/utils/auth/utils";
import { deleteLocationWizform } from "@/utils/queries/map/deleteEntryMutation";
import { SelectableWizform } from "@/utils/queries/map/types";
import { Accordion, Button, ButtonGroup, Group, List, Popover, PopoverDropdown, PopoverTarget, Text, UnstyledButton } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";
import LocationEntryCommentCreator from "./commentCreator";
import { IconQuestionMark, IconTrashFilled, IconWritingSignOff } from "@tabler/icons-react";
import WizformsListItem from "./wizformListItem";

function WizformsList(params: {
    currentLocation: string,
    auth: AuthProps,
    modelRemovedCallback: (id: string, selectable: SelectableWizform) => void,
    commentAddedCallback: (id: string, comment: string) => void,
    commentDeletedCallback: (id: string) => void
}) {
    const elements = useCommonStore(useShallow((state) => state.elements));
    const entries = useMapStore(useShallow((state) => state.entriesData?.get(params.currentLocation)));
    console.log("Entries: ", entries);

    const presentedElements = [...new Set(entries?.map(m => m.wizformElement))];
    
    async function itemDeleted(id: string, selectable: SelectableWizform) {
        params.modelRemovedCallback(id, selectable);
    }

    async function commentAdded(id: string, comment: string) {
        params.commentAddedCallback(id, comment);
    }

    async function commentDeleted(id: string) {
        params.commentDeletedCallback(id);
    }

    return <>
        <Accordion>{presentedElements.map((e, i) => (
            <Accordion.Item key={i} value={e}>
                <Accordion.Control style={{backgroundColor: 'silver'}}>{elements?.find(el => el.element == e)?.name}</Accordion.Control>
                <Accordion.Panel>
                    <List>{entries!.filter(m => m.wizformElement == e).map(m => (
                        <WizformsListItem 
                            key={m.id} 
                            item={m} 
                            auth={params.auth} 
                            deletedCallback={itemDeleted} 
                            commentAddedCallback={commentAdded}
                            commentDeletedCallback={commentDeleted}
                        />
                    ))}</List> 
                </Accordion.Panel>
            </Accordion.Item>
        ))}
        </Accordion>
    </>
}

export default WizformsList;