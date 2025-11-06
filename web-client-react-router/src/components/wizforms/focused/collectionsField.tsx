import { useActiveBook } from "@/contexts/activeBook";
import { RegistrationState, useAuth } from "@/contexts/auth";
import { useWizformsList } from "@/contexts/wizformsList";
import { addCollectionItem } from "@/queries/collections/addItemMutation";
import { removeCollectionItem } from "@/queries/collections/removeItemMutation";
import { Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

function CollectionsField({wizformId, inCollectionId}: {
    wizformId: string,
    inCollectionId: string | null
}) {
    const wizformsList = useWizformsList();
    const auth = useAuth();
    const activeBook = useActiveBook();

    const [localCollectionId, setLocalCollectionId] = useState<string | null>(inCollectionId);

    if (auth?.registrationState != RegistrationState.Confirmed || activeBook?.currentCollection == null) {
        return null;
    }

    const addToCollectionMutation = useMutation({
        mutationFn: addCollectionItem,
        onSuccess(data, _variables, _context) {
            if (data) {
                wizformsList?.addItemToCollection(wizformId, data.createdId);
                setLocalCollectionId(data.createdId);
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
                wizformsList?.removeItemFromCollection(wizformId);
                setLocalCollectionId(null);
                notifications.show({
                    message: "Фея удалена из коллекции",
                    color: 'red',
                    autoClose: 5000
                })
            }
        }
    })

    return (
        !localCollectionId ?
        <Group justify="flex-end" mt="md" pt="md">
            <Button color='lime' loading={addToCollectionMutation.isPending} onClick={() => {
                addToCollectionMutation.mutate({collectionId: activeBook.currentCollection!, wizformId: wizformId!})
            }}
            >Добавить в текущую коллекцию</Button>
        </Group> :
        <Group justify="flex-end" mt="md" pt="md">
            <Button color='pink' loading={removeFromCollectionMutation.isPending} onClick={() => {
                removeFromCollectionMutation.mutate({id: localCollectionId})
            }}
            >Удалить из текущей коллекции</Button>
        </Group>
    )
}

export default CollectionsField;