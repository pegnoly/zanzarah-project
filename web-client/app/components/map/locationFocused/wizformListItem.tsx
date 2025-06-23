import { AuthProps, RegistrationState, UserPermissionType } from "@/utils/auth/utils";
import { deleteLocationWizform } from "@/utils/queries/map/deleteEntryMutation";
import { LocationWizformEntry, SelectableWizform } from "@/utils/queries/map/types";
import { Button, ButtonGroup, Group, Image, Popover, PopoverDropdown, PopoverTarget, Text, UnstyledButton } from "@mantine/core";
import { IconQuestionMark, IconTrashFilled, IconWritingSignOff } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import LocationEntryCommentCreator from "./commentCreator";
import { useDisclosure } from "@mantine/hooks";
import { removeLocationEntryComment } from "@/utils/queries/map/removeCommentMutation";

function WizformsListItem(params: {
    item: LocationWizformEntry,
    auth: AuthProps,
    deletedCallback: (id: string, selectable: SelectableWizform) => void,
    commentAddedCallback: (id: string, comment: string) => void,
    commentDeletedCallback: (id: string) => void
}) {
    const [item, setItem] = useState<LocationWizformEntry>(params.item);

    const deleteLocationEntryMutation = useMutation({
        mutationFn: deleteLocationWizform,
        onSuccess(data, variables, context) {
            if (data) {
                params.deletedCallback(variables.data.id, data!);
            }
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: removeLocationEntryComment,
        onSuccess(data, variables, context) {
            setItem({...item, comment: null});
            params.commentDeletedCallback(variables.data.id);
        },
    })

    async function commentAdded(id: string, comment: string) {
        setItem({...item, comment: comment});
        params.commentAddedCallback(id, comment);
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '1%'}}>
            {
                (item.comment || (item.comment && item.comment.length > 0)) ? 
                <Group gap="xs" align="end">
                    <Text>{item.wizformName}</Text>
                    <Popover>
                        <PopoverTarget>
                            <UnstyledButton size="compact-xs">
                                <IconQuestionMark />
                            </UnstyledButton>
                        </PopoverTarget>
                        <PopoverDropdown>
                            <Text>{item.comment!}</Text>
                        </PopoverDropdown>
                    </Popover>
                </Group> :
                <div style={{width: '100%', display: 'flex', flexDirection: 'row', gap: '2%', alignItems: 'center'}}>
                    <Image style={{width: 40, height: 40}} src={`data:image/bmp;base64,${item.icon}`}/>
                    <Text>{item.wizformName}</Text>
                </div>
            }
            {
                params.auth.userState == RegistrationState.Confirmed &&
                (params.auth.userPermission == (UserPermissionType.Admin || UserPermissionType.Editor)) ?
                <ButtonGroup style={{alignItems: 'end'}}>
                    <Button onClick={() => deleteLocationEntryMutation.mutate({data: {id: item.id}})} size="compact-xs">
                        <IconTrashFilled/>
                    </Button>
                    <LocationEntryCommentCreator
                        entryId={item.id} 
                        initialComment={item.comment ? item.comment : ""} 
                        createCommentCallback={commentAdded}
                    />
                    <Button onClick={() => deleteCommentMutation.mutate({data: {id: item.id}})} c="red" size="compact-xs">
                        <IconWritingSignOff/>
                    </Button>
                </ButtonGroup> :
                null
            }
        </div>
    )
}

export default WizformsListItem;