import { Badge, Button, Card, Divider, Group, Loader, Modal, Popover, Select, SimpleGrid, Text, TextInput } from "@mantine/core";
import { RegistrationState, useAuth } from "@/contexts/auth";
import AuthForm from "../auth/authForm";
import { useEffect, useState } from "react";
import type { CollectionModel } from "@/queries/collections/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCollections } from "@/queries/collections/collectionsQuery";
import { useActiveBook } from "@/contexts/activeBook";
import { setActiveCollection } from "@/queries/collections/setActiveCollectionMutation";
import { useDisclosure } from "@mantine/hooks";
import { CurrentBookStore } from "@/stores/currentBook";
import { createCollection } from "@/queries/collections/createCollectionMutation";
import { getEntriesCount } from "@/queries/collections/entriesCountQuery";

function useEntriesCount(collectionId: string) {
    return useQuery({
        queryKey: ['collection_entries_count', collectionId],
        queryFn: async() => {
            const data = await getEntriesCount({collectionId: collectionId});
            return data;
        }
    })
}

function CollectionsPreview() {
    const auth = useAuth();

    return <Card w="100%" h="100%" withBorder radius={0}>
        <Badge size="lg" radius={0}>
            Коллекции
        </Badge>
        <div style={{width: '100%', height: '90%', paddingTop: '3%'}}>
            <SimpleGrid cols={{lg: 2, base: 1}}>
                {
                    auth?.registrationState != RegistrationState.Confirmed ?
                    <AuthForm/> :
                    <CollectionsRenderer/>
                }
                <CollectionsInfo/>
            </SimpleGrid>
        </div>
    </Card>
}

function CollectionsInfo() {

    const auth = useAuth();

    return <div style={{paddingTop: '3%'}}>
        <Text style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingBottom: '1%'}}>Коллекции позволяют отслеживать ваш прогресс при сборе фей.</Text>
        <Divider/>
        <Text 
            style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingTop: '1%'}}
        >При наличии активной коллекции вы можете добавлять в нее фей через интерфейс книги.</Text>
        <Divider/>
        <Text 
            style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingTop: '1%'}}
        >Созданные коллекции привязаны к версии мода и сбрасываются, если новые версии вносят несовместимые изменения.</Text>
        {
            auth?.registrationState != RegistrationState.Confirmed ?
            <>
                <Divider/>
                <Text 
                    style={{fontFamily: 'Comfortaa', fontSize: '1rem', fontWeight: 'bold', paddingTop: '1%', color: 'red'}}
                >Необходимо завершить регистрацию, чтобы использовать коллекции.</Text>
            </> :
            null
        }
    </div>
}

function CollectionsRenderer() {
    const activeBook = useActiveBook();
    const [collections, setCollections] = useState<CollectionModel [] | undefined>(undefined);

    async function onCollectionCreated(value: CollectionModel) {
        setCollections([...collections!, value]);
    }

    async function onCollectionSelected(updated: string) {
        const updatedCollections = collections?.map(c => {
            if (c.id == updated) {
                c.active = true;
                return c;
            } else {
                c.active = false;
                return c;
            }
        });
        setCollections(updatedCollections);
    }

    return <>
        {
            activeBook?.id == undefined ? 
            <>
                Необходимо выбрать книгу, чтобы создать коллекцию
            </> :
            <div style={{display: 'flex', flexDirection: 'column', justifyItems: 'center', gap: '4%'}}>
                {
                    collections == undefined ? null :
                    <>
                        <CollectionSelector models={collections!} selectCallback={onCollectionSelected}/>
                        <CollectionCreator collectionCreatedCallback={onCollectionCreated}/>
                        <CurrentCollection model={collections?.find(c => c.active)}/>
                    </>
                }
            </div>
        }
        {
            activeBook?.id == undefined ? null : <CollectionsLoader onLoad={setCollections}/> 
        }
    </>
}

function useCollections(userId: string, bookId: string) {
    return useQuery({
        queryKey: ['collections', userId, bookId],
        queryFn: async() => {
            return fetchCollections({userId: userId, bookId: bookId});
        }
    })
}

function CollectionsLoader({onLoad}: {onLoad: (data: CollectionModel[]) => void}) {
    const auth = useAuth();
    const activeBook = useActiveBook();

    const { data } = useCollections(auth?.userId!, activeBook?.id!);
    
    useEffect(() => {
        if (data != undefined) {
            onLoad(data);
        }
    }, [data]);

    return null;
}

function CurrentCollection({model}: {
    model: CollectionModel | undefined
}) {

    if (model == undefined) {
        return <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1rem'}}>Нет активной коллекции</Text>
    }

    const { data, status } = useEntriesCount(model.id);

    return <>
        <div style={{display: 'flex', flexDirection: 'row', gap: '3%'}}>
            <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem',}}>{`Текущая коллекция: `}</Text>
            <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem', color: 'green'}}>{model.name}</Text>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', gap: '3%'}}>
            <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem'}}>Фей в коллекции: </Text>
            {
                status === 'pending' ?
                <Loader size="xs"/> :
                <Text style={{fontFamily: 'Yanone Kaffeesatz', fontSize: '1.4rem', color: 'green'}}>{data}</Text>
            }
        </div>
    </>
}

function CollectionSelector({models, selectCallback}: {
    models: CollectionModel [],
    selectCallback: (updated: string) => void
}) { 
    const [currentCollection, setCurrentCollection] = useState<string | null>(models.find(c => c.active)?.id!)

    const setActiveCollectionMutation = useMutation({
        mutationFn: setActiveCollection,
        onSuccess(_data, variables, _context) {
            selectCallback(variables.collectionId)
        },
    })

    async function updateCurrentCollection(value: string | null) {
        if (value) {
            setCurrentCollection(value);
            setActiveCollectionMutation.mutate({collectionId: value!});
        }
    }

    return (
        <Popover>
            <Popover.Target>
                <Button radius={0}>Выбрать коллекцию</Button>
            </Popover.Target>
            <Popover.Dropdown>
                <Select
                    radius={0}
                    label="Список коллекций текущей книги"
                    placeholder="Установите активную коллекцию"
                    value={currentCollection}
                    onChange={updateCurrentCollection}
                    data={models.map((c) => ({
                        label: c.name, value: c.id
                    }))}
                />
            </Popover.Dropdown>
        </Popover>
    )
}

function CollectionCreator({collectionCreatedCallback}: {
    collectionCreatedCallback: (value: CollectionModel) => void
}) {
    const [opened, {open, close}] = useDisclosure(false);
    const [name, setName] = useState<string>("");

    const activeBook = useActiveBook();
    const bookName = CurrentBookStore.useName();
    const bookVersion = CurrentBookStore.useVersion();

    const auth = useAuth();

    const createCollectionMutation = useMutation({
        mutationFn: createCollection,
        onSuccess: (data) => {
            if (data != undefined) {
                collectionCreatedCallback(data);
            }
        }
    })

    return <>
        <Button radius={0} onClick={open}>Создать новую коллекцию</Button>
        <Modal.Root opened={opened} onClose={close} centered={true}>
            <Modal.Overlay/>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title style={{fontSize: 25}}>{`Создание коллекции для книги ${bookName} версии ${bookVersion}`}</Modal.Title>
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
                                    createCollectionMutation.mutate({bookId: activeBook?.id!, userId: auth?.userId!, name: name});
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