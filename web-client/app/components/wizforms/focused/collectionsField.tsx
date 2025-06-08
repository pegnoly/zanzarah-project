import useWizformsStore from "@/stores/wizforms";
import { addCollectionItem } from "@/utils/queries/collections/addItemMutation";
import { removeCollectionItem } from "@/utils/queries/collections/removeItemMutation";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useShallow } from "zustand/shallow";

function CollectionsField(params: {
    currentCollection: string,
    wizformId: string,
    inCollectionId: string | null
}) {
    const [wizforms, setWizforms, wizformId, setWizformId, collectionId, setCollectionId] = useWizformsStore(useShallow((state) => [
        state.wizforms,
        state.setWizforms,
        state.focusedWizformId,
        state.setFocusedWizformId,
        state.focusedWizformCollectionId,
        state.setFocusedWizformCollectionId
    ]));

    if (wizformId == undefined || wizformId != params.wizformId) {
        setWizformId(params.wizformId);
    }

    if (collectionId == undefined || (collectionId != undefined && wizformId != params.wizformId)) {
        setCollectionId(params.inCollectionId);
    }

    const addToCollectionMutation = useMutation({
        mutationFn: addCollectionItem,
        onSuccess(data, variables, context) {
            if (data) {
                setWizforms(
                    wizforms?.map(w => {
                        if (w.id == params.wizformId) { 
                            w.inCollectionId = "optimistically_updated";
                            return w;
                        } else {
                            return w;
                        }
                    })!
                );
                setCollectionId(data.createdId);
                notifications.show({
                    message: "Фея добавлена в коллекцию",
                    color: 'green',
                    autoClose: 5000
                })
            }
        },
    });

    const removeFromCollectionMutation = useMutation({
        mutationFn: removeCollectionItem,
        onSuccess: (data) => {
            if (data) {
                setWizforms(
                    wizforms?.map(w => {
                        if (w.id == params.wizformId) { 
                            w.inCollectionId = null;
                            return w;
                        } else {
                            return w;
                        }
                    })!
                );
                setCollectionId(null);
                notifications.show({
                    message: "Фея удалена из коллекции",
                    color: 'red',
                    autoClose: 5000
                })
            }
        }
    })

    return (
        !collectionId ?
        <Group justify="flex-end" mt="md" pt="md">
            <Button color='lime' loading={addToCollectionMutation.isPending} onClick={() => {
                addToCollectionMutation.mutate({data:{collectionId: params.currentCollection!, wizformId: params.wizformId!}})
            }}
            >Добавить в текущую коллекцию</Button>
        </Group> :
        <Group justify="flex-end" mt="md" pt="md">
            <Button color='pink' loading={removeFromCollectionMutation.isPending} onClick={() => {
                removeFromCollectionMutation.mutate({data: {id: collectionId}})
            }}
            >Удалить из текущей коллекции</Button>
        </Group>
    )
}

export default CollectionsField;