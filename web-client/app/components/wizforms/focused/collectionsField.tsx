import { addCollectionItem } from "@/utils/queries/collections/addItemMutation";
import { removeCollectionItem } from "@/utils/queries/collections/removeItemMutation";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";

function CollectionsField(params: {
    currentCollection: string,
    wizformId: string,
    inCollectionId: string | null,
    addToCollectionCallback: (value: string) => void,
    removeFromCollectionCallback: () => void
}) {
    const addToCollectionMutation = useMutation({
        mutationFn: addCollectionItem,
        onSuccess(data, variables, context) {
            if (data) {
                params.addToCollectionCallback(data.createdId);
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
                params.removeFromCollectionCallback();
                notifications.show({
                    message: "Фея удалена из коллекции",
                    color: 'red',
                    autoClose: 5000
                })
            }
        }
    })

    return (
        !params.inCollectionId ?
        <Group justify="flex-end" mt="md" pt="md">
            <Button color='lime' loading={addToCollectionMutation.isPending} onClick={() => {
                addToCollectionMutation.mutate({data:{collectionId: params.currentCollection!, wizformId: params.wizformId!}})
            }}
            >Добавить в текущую коллекцию</Button>
        </Group> :
        <Group justify="flex-end" mt="md" pt="md">
            <Button color='pink' loading={removeFromCollectionMutation.isPending} onClick={() => {
                removeFromCollectionMutation.mutate({data: {id: params.inCollectionId!}})
            }}
            >Удалить из текущей коллекции</Button>
        </Group>
    )
}

export default CollectionsField;