import { addLocationEntryComment } from "@/utils/queries/map/addCommentMutation";
import { Button, Popover, PopoverDropdown, PopoverTarget, Stack, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconWritingSign } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function LocationEntryCommentCreator(params: {
    entryId: string,
    initialComment: string | null,
    createCommentCallback: (entryId: string, comment: string | null) => void
}) {
    const [opened, {open, close}] = useDisclosure(false);
    const [commentText, setCommentText] = useState<string | null>(params.initialComment);

    const addLocationEntryCommentMutation = useMutation({
        mutationFn: addLocationEntryComment,
        onSuccess(data, variables, context) {
            if (data) {
                close();
                params.createCommentCallback(variables.data.id, variables.data.comment);
                setCommentText("");
            }
        },
    })

    return (
        <Popover opened={opened} position="bottom">
            <PopoverTarget>
                <Button onClick={open} c="green" size="compact-xs">
                    <IconWritingSign/>
                </Button>
            </PopoverTarget>
            <PopoverDropdown>
                <Stack>
                    <Textarea rows={6} value={commentText!} onChange={(e) => setCommentText(e.currentTarget.value)}/>
                    <Button onClick={() => addLocationEntryCommentMutation.mutate({data: {id: params.entryId, comment: commentText!}})}>Сохранить</Button>
                </Stack>
            </PopoverDropdown>
        </Popover>
    )
}

export default LocationEntryCommentCreator;