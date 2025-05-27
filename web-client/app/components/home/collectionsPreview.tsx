import { Badge, Button, Card, Group, Modal, NumberInput, Select, Text, TextInput } from "@mantine/core";
import { useCommonStore } from "../../stores/common";
import { useShallow } from "zustand/shallow";
import { CollectionModel, createCollection, fetchCollections, setActiveCollection } from "../../utils/queries/collections";
import { AuthProps, RegistrationState } from "../../utils/auth/utils";
import RegistrationForm from "../auth/registrationForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { confirmCode } from "../../utils/auth/confirmCode";
import ConfirmationForm from "../auth/confirmationForm";
import { useDisclosure } from "@mantine/hooks";
import { BookFullModel } from "../../utils/queries/books";
import { useNavigate, useRouter } from "@tanstack/react-router";

function fetchCollectionsOnClient(bookId: string, userId: string) {
    return useQuery({
        queryKey: ['collections'],
        queryFn: async() => {
            const data = await fetchCollections({data: {bookId: bookId, userId: userId}});
            return data;
        },
    });
}

function CollectionsPreview(params: {
    currentCollections: CollectionModel [] | undefined,
    currentBook: BookFullModel | null,
    authData: AuthProps
}) {
    return <Card w="100%" h="100%">
        <Badge size="lg" radius={0}>
            Коллекции
        </Badge>
        <Text>Коллекции позволяют отслеживать ваш прогресс при сборе фей</Text>
        {
            params.authData.userState != RegistrationState.Confirmed ?
            <RegisterPreview/> :
            <CollectionsRenderer 
                currentBook={params.currentBook} 
                collections={params?.currentCollections} 
                auth={params.authData} 
            />
        }
    </Card>
}

function CollectionsRenderer(params: {
    collections: CollectionModel [] | undefined,
    currentBook: BookFullModel | null,
    auth: AuthProps,
}) {
    const [collections, setCollections] = useState<CollectionModel []>(params.collections!);
    //const itemsInCollection = useCommonStore(state => state.itemsInCollection);

    async function onCollectionCreated(value: CollectionModel) {
        setCollections([...collections, value]);
    }

    async function onCollectionSelected() {
        const { status, data, error, isFetching } = fetchCollectionsOnClient(params.currentBook?.id!, params.auth.userId!);
        setCollections(data?.collections!);
    }

    return <>
        {
            params.currentBook == null ? 
            <>
                Необходимо выбрать книгу, чтобы создать коллекцию
            </> :
            <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center'}}>
                <Text>{`В текущей коллекции ${collections.find(c => c.active)?.entriesCount}`}</Text>
                <CollectionSelector models={collections} selectCallback={onCollectionSelected}/>
                <CollectionCreator bookData={params.currentBook} currentUser={params.auth.userId!} collectionCreatedCallback={onCollectionCreated}/>
            </div>
        }
    </>
}

function CollectionSelector(params: {
    models: CollectionModel [],
    selectCallback: () => void
}) { 
    const navigate = useNavigate();
    const [currentCollection, setCurrentCollection] = useState<string | null>(params.models.find(c => c.active)?.id!)

    const setActiveCollectionMutation = useMutation({
        mutationFn: setActiveCollection,
        onSuccess: (data) => {
            // я ебал мать
            navigate({to: ".", reloadDocument: true});
        }
    })

    async function updateCurrentCollection(value: string) {
        setCurrentCollection(value);
        setActiveCollectionMutation.mutate({data: {collectionId: value!}});
    }

    return <>
        <Select
            label="Список коллекций текущей книги"
            placeholder="Установите активную коллекцию"
            value={currentCollection}
            onChange={updateCurrentCollection}
            data={params.models.map((c) => ({
                label: c.name, value: c.id
            }))}
        />
    </>
}

function CollectionCreator(params: {
    bookData: BookFullModel,
    currentUser: string,
    collectionCreatedCallback: (value: CollectionModel) => void
}) {
    const [opened, {open, close}] = useDisclosure(false);
    const [name, setName] = useState<string>("");

    const createCollectionMutation = useMutation({
        mutationFn: createCollection,
        onSuccess: (data) => {
            if (data != undefined) {
                params.collectionCreatedCallback(data);
            }
        }
    })

    return <>
        <Button onClick={open}>Создать новую коллекцию</Button>
        <Modal.Root opened={opened} onClose={close} centered={true}>
            <Modal.Overlay/>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title style={{fontSize: 25}}>{`Создание коллекции для книги ${params.bookData.name} версии ${params.bookData.version}`}</Modal.Title>
                    <Modal.CloseButton/>
                </Modal.Header>
                <Modal.Body>
                    <TextInput 
                        value={name} 
                        onChange={(e) => setName(e.currentTarget.value)}
                        placeholder="Введите имя коллекции"
                        label="Имя новой коллекции"
                    />
                    <Group justify="flex-end" mt="md">
                        <Button 
                            onClick={
                                () => {
                                    createCollectionMutation.mutate({data: {bookId: params.bookData.id, userId: params.currentUser!, name: name}});
                                    close();
                                }
                            } 
                            type="submit">Создать</Button>
                    </Group>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    </>
}

export default CollectionsPreview;

function RegisterPreview() {
    const registrationState = useCommonStore(state => state.registrationState);

    switch (registrationState) {
        case RegistrationState.Unregistered:
            return <>
                <Text>Необходимо зарегистрироваться, чтобы пользоваться функционалом коллекций</Text>
                <RegistrationForm/>
            </>
        case RegistrationState.Unconfirmed:
            return <ConfirmationForm/>
        default:
            <>Коллекции</>
            // <Select
            //     value={currentCollection}
            //     data={params.currentCollections!.map((c) => ({
            //         label: c.name, value: c.id 
            //     }))}
            // /> 
            break;
    }
}